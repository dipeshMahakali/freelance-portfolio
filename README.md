# Dipesh Patel — Freelance Web Studio Portfolio

A high-converting, SEO-optimized freelance studio portfolio website built for **Dipesh Patel** (Freelance Web Designer & Developer for Small Businesses, Local Brands, and Startups). Designed with a **Warm Ivory Editorial / High-End Studio Aesthetic**, live project previews, interactive comparison tools, and an integrated multi-step project enquiry system.

![Live Website Banner](assets/after-website.webp)

---

## 🚀 Live Demo & Deployment

* **Live Website URL**: [https://dipesh-patel.vercel.app/](https://dipesh-patel.vercel.app/)
* **Platform**: Vercel (Serverless Static + API Function)

---

## ✨ Features & Architecture

1. **Editorial Studio Design & Theme**:
   * Custom CSS design system with CSS custom properties (`:root`).
   * Typography featuring Google Fonts: **Syne** (Headings) & **Plus Jakarta Sans** (Body text).
   * Micro-animations, interactive website mockups, and subtle background noise overlay.

2. **Selected Work & Live Previews**:
   * Case studies for flagship projects (**V K Shipping Services**, **Maa Bamleshwari Temple**, **Titan Forge Gym**, **VK Impex**).
   * Industry category filtering (Corporate & Logistics, Fitness, Cultural, All).
   * Live preview windows using sandboxed `<iframe>` tags and direct live link triggers.

3. **Visual Transformation (Before / After Slider)**:
   * Interactive drag slider demonstrating old vs redesign transformation for client websites.

4. **Multi-Step Project Enquiry Form**:
   * Dynamic modal form collecting project type, budget range, timeline, and client details.
   * Connected to `/api/enquiry.js` serverless function with Nodemailer SMTP email integration.

5. **Complete Search Engine Optimization (SEO)**:
   * Google Search Console HTML verification file (`googleb0b35c357392eda3.html`).
   * Schema.org `WebSite` JSON-LD & `ProfessionalService` structured data.
   * Custom Google Search-compliant 48x48px favicons & SVG brand icons.
   * `sitemap.xml` and `robots.txt` configuration.

---

## 📁 Project Structure

```text
freelance-portfolio/
├── api/
│   └── enquiry.js               # Vercel serverless function for contact form submission & SMTP
├── assets/                      # High-res screenshots, portraits, and showcase images
│   ├── after-website.webp
│   ├── before-website.webp
│   ├── dipesh-profile.webp
│   ├── maa-bamleshwari.webp
│   ├── titan-forge.webp
│   ├── vk-impex.webp
│   └── vk-shipping.webp
├── apple-touch-icon.webp        # iOS Home screen icon (180x180)
├── favicon.ico                  # Standard browser icon (16x16, 32x32, 48x48)
├── favicon.svg                  # Vector SVG logo icon
├── favicon-32x32.webp           # 32x32 WebP favicon
├── favicon-48x48.webp           # Google Search required 48x48 WebP favicon
├── googleb0b35c357392eda3.html  # Google Search Console domain verification file
├── icon-192x192.webp            # PWA Android icon
├── icon-512x512.webp            # High-res PWA icon
├── index.html                   # Primary HTML markup with full SEO meta tags & schema
├── package.json                 # Node dependencies (Nodemailer, Express, Cors, Dotenv)
├── robots.txt                   # Crawler directives allowing full search indexing
├── script.js                    # Navigation, before/after slider, modal, & form logic
├── server.js                    # Local Express server backend for development testing
├── site.webmanifest             # Web App Manifest for mobile and favicon definitions
├── sitemap.xml                  # XML Sitemap for search engines
├── styles.css                   # Core design system and CSS stylesheet
└── vercel.json                  # Vercel serverless deployment routing config
```

---

## 🛠️ Local Development & Setup

### Prerequisites
* **Node.js**: v16+ or higher
* **npm**: v8+

### Installation Steps

1. **Clone or navigate to the workspace**:
   ```bash
   cd freelance-portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   PORT=3000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=dipesh.patel1902@gmail.com
   SMTP_PASS=your_gmail_app_password
   NOTIFICATION_EMAIL=dipesh.patel1902@gmail.com
   ```

4. **Run Local Server**:
   ```bash
   npm run dev
   # or
   node server.js
   ```
   Open `http://localhost:3000` in your browser.

---

## 🚢 Deployment on Vercel

This repository is pre-configured for seamless Vercel deployment:

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy production website"
   git push origin main
   ```
2. **Connect to Vercel**:
   * Import the repository in [Vercel Dashboard](https://vercel.com).
   * Set Environment Variables (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `NOTIFICATION_EMAIL`) in **Vercel Project Settings > Environment Variables**.
   * Deploy! `vercel.json` routes `/api/enquiry` automatically to `api/enquiry.js`.

---

## 📄 License & Credits

* Designed and Developed by **Dipesh Patel**.
* All rights reserved © 2026 Dipesh Patel.
