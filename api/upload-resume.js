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

// Helper to safely read incoming request body into Buffer (handles both streams and pre-parsed bodies)
async function getRawBody(req) {
  if (Buffer.isBuffer(req.body)) {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return Buffer.from(req.body, 'binary');
  }
  if (req.body && typeof req.body === 'object' && req.body.data) {
    return Buffer.from(req.body.data);
  }
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
  const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  // -------------------------------------------------------------
  // GET: Check current resume status & metadata
  // -------------------------------------------------------------
  if (req.method === 'GET') {
    try {
      if (hasBlobToken) {
        try {
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
              cloudConnected: true,
              isVercel,
              url: latest.url,
              downloadUrl: latest.downloadUrl || latest.url,
              pathname: latest.pathname,
              size: latest.size,
              uploadedAt: latest.uploadedAt
            });
          }
        } catch (blobErr) {
          console.warn('Vercel Blob list error:', blobErr.message);
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
          cloudConnected: hasBlobToken,
          isVercel,
          url: '/assets/resume.pdf',
          size: stat.size,
          uploadedAt: meta.uploadedAt || stat.mtime.toISOString(),
          originalName: meta.originalName || 'Dipesh_Patel_Resume.pdf'
        });
      }

      return res.status(200).json({
        success: true,
        hasResume: false,
        cloudConnected: hasBlobToken,
        isVercel,
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
      const buffer = await getRawBody(req);

      if (!buffer || buffer.length === 0) {
        return res.status(400).json({ success: false, error: 'Empty file payload received.' });
      }

      // Check max size (Vercel Serverless Function payload limit is 4.5MB)
      const MAX_SIZE = 4.5 * 1024 * 1024;
      if (buffer.length > MAX_SIZE) {
        return res.status(400).json({
          success: false,
          error: `File size (${(buffer.length / (1024 * 1024)).toFixed(1)} MB) exceeds the maximum serverless limit of 4.5 MB. Please compress your PDF before uploading.`
        });
      }

      // Validate PDF signature (ISO 32000-1 specification: %PDF- within the first 1024 bytes)
      const headerChunk = buffer.slice(0, 1024).toString('binary');
      if (!headerChunk.includes('%PDF-')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file format. Uploaded file is not a valid PDF document.'
        });
      }

      // Decode file name safely from custom header
      let originalName = 'Dipesh_Patel_Resume.pdf';
      if (req.headers['x-file-name']) {
        try {
          originalName = decodeURIComponent(req.headers['x-file-name']);
        } catch (e) {
          originalName = req.headers['x-file-name'];
        }
      }
      const now = new Date().toISOString();

      // If Vercel Blob is configured (production persistent cloud storage):
      if (hasBlobToken) {
        const { put, list, del } = require('@vercel/blob');

        // 1. Upload new blob first so existing resume remains available during upload
        const blob = await put('resumes/Dipesh_Patel_Resume.pdf', buffer, {
          access: 'public',
          contentType: 'application/pdf',
          addRandomSuffix: true
        });

        // 2. Clean up older blobs after successful upload
        try {
          const prev = await list({ prefix: 'resumes/Dipesh_Patel_Resume' });
          if (prev.blobs && prev.blobs.length > 1) {
            const oldBlobs = prev.blobs.filter(b => b.url !== blob.url);
            if (oldBlobs.length > 0) {
              await del(oldBlobs.map(b => b.url));
            }
          }
        } catch (cleanupErr) {
          console.warn('Could not clean old blobs:', cleanupErr.message);
        }

        return res.status(200).json({
          success: true,
          message: 'Resume PDF uploaded to Vercel Blob CDN and published successfully!',
          storageType: 'vercel-blob',
          url: blob.url,
          downloadUrl: blob.downloadUrl || blob.url,
          size: buffer.length,
          uploadedAt: now,
          originalName
        });
      }

      // If on Vercel or AWS Lambda and BLOB_READ_WRITE_TOKEN is missing:
      if (isVercel) {
        return res.status(422).json({
          success: false,
          needsConfig: true,
          error: 'Vercel Blob storage is not connected yet. Vercel serverless functions have a read-only filesystem (EROFS), so persistent uploads require Vercel Blob. Please connect a Blob store in your Vercel Project Dashboard (Storage → Create Database → Blob) to enable 1-click cloud uploads from any device.'
        });
      }

      // Fallback for Local Development (node server.js): Save to assets directory
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
        message: 'Resume PDF saved successfully to local assets!',
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
