/**
 * Dipesh Patel Web Studio - Vercel Serverless Function Handler
 * Path: /api/enquiry.js
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    let data = req.body;
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch(e) {}
    }
    data = data || {};

    const submittedAt = new Date().toISOString();
    const leadRecord = {
      id: 'lead_' + Date.now(),
      submittedAt,
      clientName: data.clientName || 'Anonymous Prospect',
      clientEmail: data.clientEmail || 'Not provided',
      clientPhone: data.clientPhone || 'Not provided',
      projectType: data.projectType || 'Not specified',
      budget: data.budget || 'Not specified',
      timeline: data.timeline || 'Not specified',
      businessDetails: data.businessDetails || 'No details provided'
    };

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER || 'dipeshmahakali@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'hoozhrsseuwzhipu';
    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.NOTIFY_EMAIL || 'dipesh.patel1902@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || smtpUser;

    let emailSent = false;
    let emailError = null;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
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

      try {
        await transporter.sendMail({
          from: `"Dipesh Studio Enquiry" <${fromEmail}>`,
          to: recipientEmail,
          subject: `🚀 New Web Studio Enquiry: ${leadRecord.clientName} (${leadRecord.projectType})`,
          html: emailHtml
        });
        emailSent = true;
      } catch (err) {
        console.error('Vercel SMTP Send Error:', err);
        emailError = err.message;
      }
    }

    return res.status(200).json({
      success: true,
      message: emailSent ? 'Enquiry received and email notification sent!' : 'Enquiry received.',
      emailSent,
      emailError,
      leadId: leadRecord.id,
      recipient: recipientEmail
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
