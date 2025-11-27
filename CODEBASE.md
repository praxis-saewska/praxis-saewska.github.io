# Codebase Documentation for Agentic Search

This document provides a comprehensive overview of the Praxis Saewska website codebase structure, key files, and important patterns to help AI agents understand and navigate the project.

## Project Overview

**Type**: Static website generator using Pelican  
**Languages**: Python 3, Jinja2 templates, Markdown content  
**Multilingual Support**: German (de), English (en), Russian (ru), Ukrainian (uk)  
**Deployment**: GitHub Pages via GitHub Actions  
**Dependency Manager**: `uv` (Python package manager)

## Project Structure

```
praxis-saewska.github.io/
├── content/                    # Source content files
│   ├── pages/                 # Markdown page files (multilingual)
│   │   ├── index.{lang}.md   # Homepage content per language
│   │   ├── about.{lang}.md   # About page per language
│   │   ├── faq.{lang}.md     # FAQ page per language
│   │   ├── privacy.{lang}.md # Privacy policy per language
│   │   └── impressum.{lang}.md # Legal notice per language
│   ├── images/                # Static images
│   ├── robots.txt            # Robots.txt for SEO
│   ├── sitemap.xml           # Sitemap for SEO
│   └── site.webmanifest      # Web manifest
├── themes/med_praxis/         # Custom Pelican theme
│   ├── templates/            # Jinja2 templates
│   │   ├── base.html        # Base template (header, footer, SEO)
│   │   ├── index.html       # Homepage template
│   │   ├── page.html        # Generic page template
│   │   ├── about.html       # About page template
│   │   ├── faq.html         # FAQ page template
│   │   ├── impressum.html   # Legal notice template
│   │   ├── privacy.html     # Privacy template
│   │   ├── 404.html         # Error page
│   │   └── macros.html      # Reusable template macros
│   ├── static/              # Static assets (CSS, JS, images)
│   │   ├── css/styles.css   # Main stylesheet
│   │   ├── js/script.js     # JavaScript functionality
│   │   └── images/          # Theme images
│   └── translations/        # Gettext translation files
│       ├── {lang}/LC_MESSAGES/
│       │   ├── messages.po  # Source translations
│       │   └── messages.mo  # Compiled translations
├── output/                   # Generated site (git-ignored)
├── pelicanconf.py           # Development configuration
├── publishconf.py           # Production configuration
├── site_data.py            # SINGLE SOURCE OF TRUTH for site data
├── compile_translations.py # Script to compile .po to .mo files
├── pyproject.toml          # Python dependencies (uv)
└── README.md               # User documentation

```

## Key Files and Their Purposes

### Configuration Files

#### `pelicanconf.py` (Development Config)
- **Purpose**: Main Pelican configuration for development
- **Key Settings**:
  - `SITEURL`: Development URL
  - `THEME`: Points to `themes/med_praxis`
  - `PLUGINS`: Uses `i18n_subsites` for multilingual support
  - `I18N_SUBSITES`: Language-specific configurations
  - Imports data from `site_data.py`
- **Important**: Contains `get_opening_hours_for_lang()` helper function

#### `publishconf.py` (Production Config)
- **Purpose**: Production configuration (extends `pelicanconf.py`)
- **Key Differences**:
  - Sets production `SITEURL` to `https://praxis-saewska.de`
  - Uses absolute URLs (`RELATIVE_URLS = False`)
  - Updates `I18N_SUBSITES` with production URLs

#### `site_data.py` (CRITICAL - Single Source of Truth)
- **Purpose**: Centralized data file for all site-wide information
- **Contains**:
  - `OPENING_HOURS`: Working hours for each day of the week
  - `CLOSED_TEXT`: Translations for "closed" in all languages
  - `CONTACT_INFO`: Address, phone, email
  - `PRACTICE_INFO`: Practice name, doctor name, specialty
- **IMPORTANT**: This is the ONLY file to edit for working hours and contact info
- **Usage**: Imported by both `pelicanconf.py` and `publishconf.py`

### Content Files

#### Page Structure (`content/pages/*.{lang}.md`)
- **Format**: Markdown with YAML frontmatter
- **Required Metadata**:
  - `Title`: Page title
  - `Lang`: Language code (de, en, ru, uk)
  - `Slug`: URL slug (must match across languages for translations)
  - `Template`: Template name (optional, defaults to `page.html`)
- **Example**:
  ```markdown
  Title: About Us
  Lang: en
  Slug: about
  Template: about

  ## Content here in Markdown
  ```

### Theme Files

#### `themes/med_praxis/templates/base.html`
- **Purpose**: Base template with header, footer, SEO meta tags
- **Key Features**:
  - Multilingual meta tags (hreflang, Open Graph, Twitter Cards)
  - Language switcher
  - Navigation menu
  - Cookie consent integration
  - Loading overlay

#### `themes/med_praxis/templates/macros.html`
- **Purpose**: Reusable Jinja2 macros
- **Key Macros**:
  - `contact_info`: Displays contact information
  - `opening_hours`: Displays working hours
  - `map_container`: Google Maps integration
  - `directions_section`: Directions information

### Translation System

#### Translation Files (`themes/med_praxis/translations/`)
- **Format**: Gettext (.po source, .mo compiled)
- **Languages**: de, en, ru, uk
- **Compilation**: Run `python compile_translations.py` or use `msgfmt`
- **Usage in Templates**: `{{ _('Text to translate') }}`

#### `compile_translations.py`
- **Purpose**: Compiles all `.po` files to `.mo` files
- **Usage**: Run before building the site if translations changed

## Important Patterns and Conventions

### Multilingual Architecture

1. **Content**: Each page has language-specific Markdown files with matching `Slug`
2. **Templates**: Use `_()` function for translatable strings
3. **URLs**: 
   - Default (de): `/`
   - English: `/en/`
   - Russian: `/ru/`
   - Ukrainian: `/uk/`
4. **Configuration**: `I18N_SUBSITES` in config files defines language-specific settings

### Data Flow

1. **Site Data**: `site_data.py` → `pelicanconf.py` → Templates
2. **Content**: Markdown files → Pelican → HTML via Jinja2 templates
3. **Translations**: `.po` files → compiled to `.mo` → loaded by Pelican i18n plugin

### Working Hours Pattern

- Stored in `site_data.py` as `OPENING_HOURS` dictionary
- Use `<br>` for line breaks (e.g., `'10:00 - 14:00<br>15:00 - 17:00'`)
- Use `'Geschlossen'` for closed days (automatically translated via `CLOSED_TEXT`)
- Function `get_opening_hours_for_lang(lang)` handles translation

### Static Files

- **Location**: `content/` directory (images, robots.txt, sitemap.xml, etc.)
- **Theme Assets**: `themes/med_praxis/static/` (CSS, JS, theme images)
- **Output**: Copied to `output/` during build
- **Configuration**: Listed in `STATIC_PATHS` in `pelicanconf.py`

## Build and Deployment

### Development Build
```bash
uv run pelican content -s pelicanconf.py
```

### Production Build
```bash
uv run pelican content -s publishconf.py
```

### Auto-reload (Development)
```bash
uv run pelican content -s pelicanconf.py -lr
```

### Deployment
- **Automatic**: GitHub Actions on push to `main` branch
- **Workflow**: `.github/workflows/deploy.yml`
- **Output**: Generated to `output/` directory, deployed to GitHub Pages

## Common Tasks

### Updating Working Hours
1. Edit `site_data.py` → `OPENING_HOURS`
2. Rebuild site

### Updating Contact Information
1. Edit `site_data.py` → `CONTACT_INFO`
2. Rebuild site

### Adding/Editing Page Content
1. Edit appropriate `content/pages/{page}.{lang}.md`
2. Rebuild site

### Adding New Translation Strings
1. Edit `themes/med_praxis/translations/{lang}/LC_MESSAGES/messages.po`
2. Run `python compile_translations.py`
3. Rebuild site

### Adding New Page
1. Create `content/pages/{slug}.{lang}.md` for each language
2. Ensure matching `Slug` across all languages
3. Optionally create custom template in `themes/med_praxis/templates/`
4. Rebuild site

## Dependencies

- **Pelican**: Static site generator
- **i18n_subsites**: Pelican plugin for multilingual sites
- **gettext**: Translation system (system dependency)
- **uv**: Python package manager (see `pyproject.toml`)

## Important Notes

1. **Never edit generated files** in `output/` directory
2. **Always edit `site_data.py`** for site-wide data changes
3. **Compile translations** after editing `.po` files
4. **Match slugs** across language versions for proper translation linking
5. **Use relative URLs** in development, absolute in production
6. **Static files** must be in `content/` or `themes/med_praxis/static/`

## Search Keywords

When searching this codebase, consider:
- **Working hours**: `OPENING_HOURS`, `site_data.py`, `opening_hours`
- **Contact info**: `CONTACT_INFO`, `site_data.py`, `contact_info`
- **Templates**: `themes/med_praxis/templates/`, `base.html`, `macros.html`
- **Translations**: `translations/`, `messages.po`, `_()`, `i18n`
- **Configuration**: `pelicanconf.py`, `publishconf.py`, `I18N_SUBSITES`
- **Content**: `content/pages/`, Markdown files with language codes
- **Styling**: `themes/med_praxis/static/css/styles.css`
- **JavaScript**: `themes/med_praxis/static/js/script.js`

