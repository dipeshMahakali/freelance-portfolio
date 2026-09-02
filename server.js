/**
 * Dipesh Patel Portfolio - Node.js Express Server with SMTP Email Notifier
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const zlib = require('zlib');

// Simple .env parser function
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...val] = line.split('=');
        process.env[key.trim()] = val.join('=').trim();
      }
    });
  }
}

loadEnv();

const PORT = process.env.PORT || 8085;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || process.env.SMTP_USER || 'dipesh.patel1902@gmail.com';

// MIME types table
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Mock Vercel Insights Script for Local Lighthouse Audits
  if (parsedUrl.pathname === '/_vercel/insights/script.js') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('/* Local Vercel Web Analytics Mock */');
    return;
  }

  // API Endpoint: POST /api/enquiry
  if (parsedUrl.pathname === '/api/enquiry' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const submittedAt = new Date().toISOString();

        // Server-side validation
        const name = (data.clientName || '').trim();
        const email = (data.clientEmail || '').trim();
        const phone = (data.clientPhone || '').trim();

        if (!name || !email || !phone) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Name, email, and phone number are required.' }));
          return;
        }

        const leadRecord = {
          id: 'lead_' + Date.now(),
          submittedAt,
          clientName: name,
          clientEmail: email,
          clientPhone: phone,
          projectType: data.projectType || 'Not specified',
          budget: data.budget || 'Not specified',
          timeline: data.timeline || 'Not specified',
          businessDetails: data.businessDetails || 'No details provided'
        };

        // Save to backup file
        const logPath = path.join(__dirname, 'api', 'enquiries_backup.json');
        let logs = [];
        if (fs.existsSync(logPath)) {
          try { logs = JSON.parse(fs.readFileSync(logPath, 'utf8')); } catch (e) {}
        }
        logs.unshift(leadRecord);
        if (!fs.existsSync(path.dirname(logPath))) fs.mkdirSync(path.dirname(logPath), { recursive: true });
        fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

        console.log(`[ENQUIRY] New lead captured from ${leadRecord.clientName} (${leadRecord.clientEmail})`);
        
        let emailSent = false;
        let emailError = null;

        // Send Email via Nodemailer if SMTP configured
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        const smtpPort = parseInt(process.env.SMTP_PORT || '587');

        if (smtpUser && smtpPass) {
          try {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
              host: smtpHost || 'smtp.gmail.com',
              port: smtpPort,
              secure: smtpPort === 465,
              auth: { user: smtpUser, pass: smtpPass }
            });

            const emailHtml = `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f2ed; color: #18181b; padding: 20px; }
                  .card { background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #e5e0d8; max-width: 600px; margin: 0 auto; }
                  .header { font-size: 20px; font-weight: 800; color: #b45309; margin-bottom: 20px; border-bottom: 2px solid #b45309; padding-bottom: 10px; }
                  .label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #71717a; margin-top: 14px; }
                  .val { font-size: 15px; font-weight: 600; color: #18181b; margin-top: 4px; }
                  .box { background-color: #f3efea; padding: 15px; border-radius: 8px; margin-top: 15px; line-height: 1.6; }
                  .footer { font-size: 12px; color: #a1a1aa; margin-top: 25px; text-align: center; }
                </style>
              </head>
              <body>
                <div class='card'>
                  <div class='header'>🚀 New Project Enquiry for Dipesh Patel Web Studio</div>
                  <div class='label'>Client Name</div>
                  <div class='val'>${leadRecord.clientName}</div>
                  <div class='label'>Email Address</div>
                  <div class='val'><a href='mailto:${leadRecord.clientEmail}'>${leadRecord.clientEmail}</a></div>
                  <div class='label'>WhatsApp / Phone</div>
                  <div class='val'><a href='tel:${leadRecord.clientPhone}'>${leadRecord.clientPhone}</a></div>
                  <div class='label'>Project Type Needed</div>
                  <div class='val'>${leadRecord.projectType}</div>
                  <div class='label'>Approximate Budget</div>
                  <div class='val'>${leadRecord.budget}</div>
                  <div class='label'>Desired Launch Timeline</div>
                  <div class='val'>${leadRecord.timeline}</div>
                  <div class='label'>Business Brief & Project Goals</div>
                  <div class='box'>${leadRecord.businessDetails}</div>
                  <div class='footer'>
                    Submitted on ${submittedAt}<br>
                    Dipesh Patel Web Studio Automated Notification System
                  </div>
                </div>
              </body>
              </html>
            `;

            await transporter.sendMail({
              from: `"Dipesh Studio Enquiry" <${process.env.FROM_EMAIL || smtpUser}>`,
              to: RECIPIENT_EMAIL,
              subject: `🚀 New Web Studio Enquiry: ${leadRecord.clientName} (${leadRecord.projectType})`,
              html: emailHtml
            });

            emailSent = true;
            console.log(`[SMTP SUCCESS] Sent lead notification email to ${RECIPIENT_EMAIL}`);
          } catch (err) {
            console.error('[SMTP ERROR] Failed to send email:', err.message);
            emailError = err.message;
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: emailSent ? 'Enquiry received! Email notification sent.' : 'Enquiry saved to log.',
          emailSent,
          emailError,
          leadId: leadRecord.id,
          recipient: RECIPIENT_EMAIL
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const cacheHeader = ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable';
    const acceptEncoding = req.headers['accept-encoding'] || '';
    const isCompressible = /text|javascript|json|html|xml|svg/.test(contentType);

    if (isCompressible && acceptEncoding.includes('gzip')) {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheHeader,
        'Content-Encoding': 'gzip'
      });
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': cacheHeader
      });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Dipesh Patel Studio Portfolio running on http://localhost:${PORT}`);
  console.log(`📧 Form submissions will send notifications to: ${RECIPIENT_EMAIL}`);
});
