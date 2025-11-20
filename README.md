# Praxis Saewska - Website

Landing page for the gynecology practice Saewska.

## Overview

This website is a simple, modern, and GDPR-compliant landing page for a gynecology practice. It was created with static HTML, CSS, and JavaScript and can be hosted directly on GitHub Pages.

## Features

- ✅ Responsive Design (mobile-first)
- ✅ GDPR-compliant with Cookie Consent Banner
- ✅ Integration with Doctolib for appointment booking (placeholder)
- ✅ Google Maps Integration (GDPR-compliant, loads only after consent)
- ✅ FAQ page with accordion functionality
- ✅ About Us page
- ✅ Contact page with map
- ✅ Privacy Policy

## Page Structure

- `index.html` - Main page with services and appointment booking
- `about.html` - About Us page with information about the doctor
- `contact.html` - Contact page with address, opening hours, and Google Maps
- `faq.html` - Frequently asked questions
- `privacy.html` - Privacy Policy (GDPR-compliant)

## Deployment on GitHub Pages

### Step 1: Prepare Repository

1. Make sure all files are in the repository:
   - `index.html`
   - `about.html`
   - `contact.html`
   - `faq.html`
   - `privacy.html`
   - `styles.css`
   - `script.js`
   - `images/file.svg`
   - `.nojekyll` (important for GitHub Pages)

2. Commit and push all changes:
   ```bash
   git add .
   git commit -m "Initial commit: Website for Praxis Saewska"
   git push origin main
   ```

### Step 2: Enable GitHub Pages

1. Go to your GitHub Repository
2. Click on **Settings**
3. Scroll to **Pages** in the left menu
4. Under **Source**, select:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **Save**

### Step 3: Access Website

After a few minutes, your website will be available at:
- `https://[Your-GitHub-Username].github.io/praxis-saewska.github.io/`

If the repository is named `praxis-saewska.github.io` and your GitHub username is `praxis-saewska`, the URL is:
- `https://praxis-saewska.github.io/`

## Customizations Before Deployment

Before going live, you should replace the following placeholders:

### 1. Contact Information
- **In `index.html` and `contact.html`:**
  - Address
  - Phone number
  - Email address
  - Opening hours

### 2. Doctolib Integration
- **In `index.html`:**
  - Replace the Doctolib placeholder with the actual widget code
  - Or add a link to your Doctolib booking page

### 3. Google Maps
- **In `contact.html`:**
  - Go to Google Maps
  - Search for your practice address
  - Click "Share" → "Embed a map"
  - Copy the iframe code
  - Replace the placeholder iframe in `contact.html`
  - **Important:** Change `src` to `data-src` for GDPR compliance

### 4. About Us Page
- **In `about.html`:**
  - Doctor's name and title
  - Qualifications
  - Professional experience
  - Professional photo
  - Memberships

### 5. Privacy Policy
- **In `privacy.html`:**
  - Update the date
  - Add your complete contact information
  - Adapt the information to your specific situation

### 6. Practice Name
- If the name is not "Praxis Saewska", replace it in all HTML files

## Technical Details

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Dependencies
- No external dependencies
- Pure HTML, CSS, and JavaScript
- No build tools required

### Files
- `styles.css` - All styles for the website
- `script.js` - JavaScript for cookie consent, FAQ accordion, mobile menu
- `images/file.svg` - Practice logo
- `images/elena-saewska.jpg` - Doctor photo
- `images/icon-*.png` - PWA icons

## Maintenance

### Reset Cookie Settings
If you want to test the cookie settings, you can delete the localStorage data in the browser:
```javascript
localStorage.removeItem('cookieConsent');
```

### Extend FAQ
Simply add new `.faq-item` blocks in `faq.html`. The accordion functionality will be applied automatically.

## Support

For questions or problems:
1. Check the browser console for errors
2. Make sure all files are uploaded correctly
3. Check the GitHub Pages settings

## License

© 2025 Praxis Saewska. All rights reserved.
