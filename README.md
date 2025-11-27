# Praxis Saewska Website

Static website for Praxis Saewska built with Pelican. Multilingual support (German, English, Russian, Ukrainian).

## Quick Start

### Setup

1. Install dependencies using `uv`:
```bash
uv sync
```

2. Build the site:
```bash
uv run pelican content -s pelicanconf.py
```

3. Preview locally:
```bash
cd output && python -m http.server 8000
```

Visit `http://localhost:8000` to view the site.

## Editing Content

### Changing Working Hours and Contact Information

**All site-wide data is managed in one file: `site_data.py`**

Edit `site_data.py` to update:

- **Working Hours** (`OPENING_HOURS`): Edit the hours for each day
  - Use `<br>` for line breaks (e.g., `'10:00 - 14:00<br>15:00 - 17:00'`)
  - Use `'Geschlossen'` for closed days (automatically translated per language)

- **Contact Information** (`CONTACT_INFO`): Update address, phone, email
  - Changes apply to all languages automatically

- **Practice Information** (`PRACTICE_INFO`): Update practice name, doctor name, specialty

**Example:**
```python
OPENING_HOURS = {
    'monday': '10:00 - 14:00<br>15:00 - 17:00',
    'tuesday': '10:00 - 14:00<br>15:00 - 17:00',
    'wednesday': '09:00 - 14:00<br>15:00 - 17:00',
    'thursday': '10:00 - 14:00<br>15:00 - 17:00',
    'friday': '10:00 - 14:00',
    'saturday': 'Geschlossen',
    'sunday': 'Geschlossen',
}

CONTACT_INFO = {
    'address_street': 'Uhlandstr. 87',
    'address_city': '10717 Berlin',
    'phone': '+49 30 12345678',
    'email': 'info@praxis-saewska.de',
}
```

After editing `site_data.py`, rebuild the site.

### Changing Pages

Pages are located in `content/pages/` with language-specific versions:

- `index.{lang}.md` - Homepage
- `about.{lang}.md` - About page
- `faq.{lang}.md` - FAQ page
- `privacy.{lang}.md` - Privacy policy
- `impressum.{lang}.md` - Legal notice

**Language codes:** `de` (German), `en` (English), `ru` (Russian), `uk` (Ukrainian)

**Page Structure:**
```markdown
Title: Page Title
Lang: en
Slug: about
Template: about

## Section Heading

Your content here in Markdown format.
```

**To edit a page:**
1. Open the appropriate file in `content/pages/` (e.g., `about.en.md`)
2. Edit the content using Markdown
3. Save and rebuild the site

**To update all languages:**
- Edit each language version separately (e.g., `about.de.md`, `about.en.md`, `about.ru.md`, `about.uk.md`)

## Building and Publishing

### Development Build
```bash
uv run pelican content -s pelicanconf.py
```

### Production Build
```bash
uv run pelican content -s publishconf.py
```

Output is generated in the `output/` directory.

## Deployment

The website is **automatically deployed** using GitHub Actions.

### How It Works

1. **Push to `main` branch** - Any changes pushed to the main branch trigger the deployment workflow
2. **Automatic build** - GitHub Actions builds the site using Pelican
3. **Automatic publish** - The generated site is automatically published to GitHub Pages

### Workflow

- Edit content in `content/pages/` or `site_data.py`
- Commit and push changes to the `main` branch
- GitHub Actions automatically builds and deploys the site
- Changes go live within a few minutes

**No manual build or deployment steps required!** Just push your changes and the site updates automatically.

## Project Structure

```
.
├── content/              # Content files
│   └── pages/           # Page markdown files
├── themes/              # Theme templates
├── site_data.py         # Site-wide data (hours, contacts)
├── pelicanconf.py       # Development configuration
├── publishconf.py       # Production configuration
└── output/              # Generated site (git-ignored)
```

## Key Files

- **`site_data.py`** - Edit working hours, contact info, practice info
- **`pelicanconf.py`** - Site configuration
- **`content/pages/`** - Page content files
- **`themes/med_praxis/`** - Theme templates and styles

## Notes

- Working hours and contact info are automatically translated per language
- The site uses clean URLs (no `.html` extensions)
- Static files (images, etc.) go in `content/images/`
- **Changes are automatically deployed** when pushed to the `main` branch via GitHub Actions
- For local testing, rebuild the site manually using the build commands above

