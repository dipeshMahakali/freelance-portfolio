/**
 * Dipesh Patel Web Studio - Public Resume Downloader / Viewer
 * Path: /api/resume.js
 * 
 * Public endpoint serving or redirecting to the latest active Resume PDF.
 */

const fs = require('fs');
const path = require('path');

// Helper to discover any Vercel Blob read-write token across common naming variations
function getBlobTokenInfo() {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.BLOB_READ_WRITE_TOKEN.trim(), keyName: 'BLOB_READ_WRITE_TOKEN' };
  }
  if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    return { token: process.env.VERCEL_BLOB_READ_WRITE_TOKEN.trim(), keyName: 'VERCEL_BLOB_READ_WRITE_TOKEN' };
  }

  // Scan process.env for any key ending in _READ_WRITE_TOKEN or containing BLOB_READ_WRITE / BLOB_TOKEN
  const envKeys = Object.keys(process.env);
  for (const key of envKeys) {
    const upper = key.toUpperCase();
    if ((upper.endsWith('_READ_WRITE_TOKEN') || upper.includes('BLOB_READ_WRITE') || upper.includes('BLOB_TOKEN')) && process.env[key]) {
      return { token: process.env[key].trim(), keyName: key };
    }
  }

  return { token: null, keyName: null };
}

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { token: blobToken } = getBlobTokenInfo();
  const hasBlobToken = Boolean(blobToken);

  try {
    // 1. Try Vercel Blob (Cloud Storage)
    if (hasBlobToken) {
      try {
        const { list } = require('@vercel/blob');
        const response = await list({ prefix: 'resumes/Dipesh_Patel_Resume', token: blobToken });
        if (response.blobs && response.blobs.length > 0) {
          const sorted = response.blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
          const latest = sorted[0];

          // Check if direct download was requested
          const urlObj = req.url ? new URL(req.url, 'http://localhost') : { searchParams: new URLSearchParams() };
          const wantsDownload = urlObj.searchParams.get('download') === '1' || (req.query && (req.query.download === '1' || req.query.download === 'true'));
          const targetUrl = wantsDownload ? (latest.downloadUrl || latest.url) : (latest.url || latest.downloadUrl);

          // Short cache so updates propagate quickly across CDN
          res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');
          return res.redirect(302, targetUrl);
        }
      } catch (blobErr) {
        console.warn('Vercel Blob fetch error, falling back to static asset:', blobErr.message);
      }
    }

    // 2. Try Local / Static Assets Fallback
    const localResumePath = path.join(process.cwd(), 'assets', 'resume.pdf');
    if (fs.existsSync(localResumePath)) {
      const stat = fs.statSync(localResumePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Disposition', 'inline; filename="Dipesh_Patel_Resume.pdf"');
      res.setHeader('Cache-Control', 'public, max-age=3600');

      const stream = fs.createReadStream(localResumePath);
      return stream.pipe(res);
    }

    // 3. Fallback if no resume has been uploaded yet
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resume Updating — Dipesh Patel</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0d0e; color: #f4f2ed; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; text-align: center; }
          .card { background: #18181b; border: 1px solid #27272a; padding: 40px 30px; border-radius: 16px; max-width: 480px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
          h1 { font-size: 1.5rem; margin-top: 15px; color: #fbbf24; }
          p { color: #a1a1aa; line-height: 1.6; margin: 15px 0 25px 0; font-size: 0.95rem; }
          a { display: inline-flex; align-items: center; gap: 8px; background: #fbbf24; color: #0c0d0e; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 9999px; transition: opacity 0.2s; }
          a:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <div style="font-size: 42px;">📄</div>
          <h1>Resume Updating</h1>
          <p>My updated resume is currently being uploaded. In the meantime, feel free to connect directly or reach out via email.</p>
          <a href="/#enquiry">Contact Dipesh Patel →</a>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error serving resume:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
