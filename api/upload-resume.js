/**
 * Dipesh Patel Web Studio - Secure Resume Upload Handler
 * Path: /api/upload-resume.js
 * 
 * Protected endpoint for owner-only PDF uploads to Vercel Blob / persistent storage.
 */

const fs = require('fs');
const path = require('path');

// Helper to safely compare admin secret
function isAuthorized(req) {
  const adminSecret = process.env.RESUME_ADMIN_SECRET || 'Dipesh_Admin_Resume_Secure_2026!';
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const customHeader = req.headers['x-admin-secret'] || '';

  return (token && token === adminSecret) || (customHeader && customHeader === adminSecret);
}

// Helper to read incoming stream into Buffer
function readStream(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', err => reject(err));
  });
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret, x-file-name');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check Authorization
  if (!isAuthorized(req)) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or missing admin credentials.'
    });
  }

  const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  // -------------------------------------------------------------
  // GET: Check current resume status & metadata
  // -------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      if (hasBlobToken) {
        const { list } = require('@vercel/blob');
        const response = await list({ prefix: 'resumes/Dipesh_Patel_Resume' });
        if (response.blobs && response.blobs.length > 0) {
          // Sort newest first
          const sorted = response.blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
          const latest = sorted[0];
          return res.status(200).json({
            success: true,
            hasResume: true,
            storageType: 'vercel-blob',
            url: latest.url,
            downloadUrl: latest.downloadUrl || latest.url,
            pathname: latest.pathname,
            size: latest.size,
            uploadedAt: latest.uploadedAt
          });
        }
      }

      // Local / Static Fallback check
      const localResumePath = path.join(process.cwd(), 'assets', 'resume.pdf');
      const metaPath = path.join(process.cwd(), 'assets', 'resume-meta.json');

      if (fs.existsSync(localResumePath)) {
        const stat = fs.statSync(localResumePath);
        let meta = {};
        if (fs.existsSync(metaPath)) {
          try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch (e) {}
        }
        return res.status(200).json({
          success: true,
          hasResume: true,
          storageType: 'local-static',
          url: '/assets/resume.pdf',
          size: stat.size,
          uploadedAt: meta.uploadedAt || stat.mtime.toISOString(),
          originalName: meta.originalName || 'Dipesh_Patel_Resume.pdf'
        });
      }

      return res.status(200).json({
        success: true,
        hasResume: false,
        message: 'No resume has been uploaded yet.'
      });
    } catch (err) {
      console.error('Error fetching resume status:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // -------------------------------------------------------------
  // POST: Upload new resume PDF
  // -------------------------------------------------------------
  if (req.method === 'POST') {
    try {
      const buffer = await readStream(req);

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ success: false, error: 'Empty file payload received.' });
      }

      // Check max size (10MB limit)
      if (buffer.length > 10 * 1024 * 1024) {
        return res.status(400).json({ success: false, error: 'File size exceeds maximum limit of 10MB.' });
      }

      // Validate PDF signature: starts with %PDF- (hex: 25 50 44 46 2d)
      const headerString = buffer.slice(0, 5).toString('ascii');
      if (!headerString.startsWith('%PDF-')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file format. Uploaded file is not a valid PDF document.'
        });
      }

      const originalName = req.headers['x-file-name'] || 'Dipesh_Patel_Resume.pdf';
      const now = new Date().toISOString();

      // If Vercel Blob is configured:
      if (hasBlobToken) {
        const { put, list, del } = require('@vercel/blob');

        // Clean up previous blobs to keep storage clean
        try {
          const prev = await list({ prefix: 'resumes/Dipesh_Patel_Resume' });
          if (prev.blobs && prev.blobs.length > 0) {
            await del(prev.blobs.map(b => b.url));
          }
        } catch (cleanupErr) {
          console.warn('Could not clean old blobs:', cleanupErr.message);
        }

        const blob = await put(`resumes/Dipesh_Patel_Resume.pdf`, buffer, {
          access: 'public',
          contentType: 'application/pdf',
          addRandomSuffix: true
        });

        return res.status(200).json({
          success: true,
          message: 'Resume PDF uploaded to Vercel Blob and published successfully!',
          storageType: 'vercel-blob',
          url: blob.url,
          downloadUrl: blob.downloadUrl || blob.url,
          size: buffer.length,
          uploadedAt: now,
          originalName
        });
      }

      // Fallback: Save to assets directory
      const assetsDir = path.join(process.cwd(), 'assets');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }

      const filePath = path.join(assetsDir, 'resume.pdf');
      fs.writeFileSync(filePath, buffer);

      const metaPath = path.join(assetsDir, 'resume-meta.json');
      fs.writeFileSync(metaPath, JSON.stringify({
        uploadedAt: now,
        size: buffer.length,
        originalName
      }, null, 2));

      return res.status(200).json({
        success: true,
        message: 'Resume PDF saved successfully!',
        storageType: 'local-static',
        url: '/assets/resume.pdf',
        size: buffer.length,
        uploadedAt: now,
        originalName
      });
    } catch (err) {
      console.error('Upload Error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method Not Allowed' });
};

