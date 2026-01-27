# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Praxis Saewska** is a multilingual static website for a medical practice, built with **Pelican** (Python static site generator). The site generates 4 language versions (German, English, Russian, Ukrainian) from a single codebase using the **i18n_subsites** plugin with gettext translations.

## Essential Commands

### Building the Site

```bash
# Build entire multilingual site (recommended - compiles translations + generates all languages)
./build.sh

# For deployment (includes all build.sh steps + production config)
python scripts/build_for_deployment.py

# Manual build process (if needed):
# 1. Compile .po translation files to .mo binary files (uses polib - no system gettext needed)
python3 scripts/compile_translations.py

# 2. Generate site (development)
uv run pelican content -s pelicanconf.py

# 3. Generate site (production)
uv run pelican content -s publishconf.py
```

**Note**: Translation compilation now uses `polib` (pure Python) instead of system `msgfmt`, eliminating the need for gettext system package.

### Local Development

```bash
# Preview locally after building
python -m http.server 8000 -d output

# Visit in browser:
# - German (main): http://localhost:8000/de/
# - English: http://localhost:8000/en/
# - Russian: http://localhost:8000/ru/
# - Ukrainian: http://localhost:8000/uk/
```

### Dependency Management

**CRITICAL: Use `uv` exclusively for dependency management. Never use `pip` or `poetry`.**

```bash
uv sync                  # Install/reinstall all dependencies from lockfile
uv add <package>         # Add new package
uv remove <package>      # Remove package
```

## Architecture

### Multilingual Build System

The site uses a sophisticated multilingual architecture:

1. **No root site generation**: `DEFAULT_LANG = "C"` is a technical placeholder. All content is generated in language subdirectories (`/de/`, `/en/`, `/ru/`, `/uk/`)
2. **Language detection**: Browser `Accept-Language` header redirects visitors to appropriate language version (handled by `.htaccess` or Cloudflare Workers)
3. **Shared translations**: UI strings are translated via gettext `.po` files, while site data (hours, contact info) is auto-translated per language from `site_data.py`
4. **i18n_subsites plugin**: Loads from project root (custom implementation in `i18n_subsites.py`), generates separate subsites for each language

### Translation System

**Two-layer translation approach:**

1. **Template UI strings**: Jinja2 templates use `{{ _('string') }}` syntax
   - Translations in `themes/med_praxis/translations/{lang}/LC_MESSAGES/messages.po`
   - Compiled to `.mo` binary files by `scripts/compile_translations.py`
   - Loaded by Pelican i18n extension at build time

2. **Site data (hours, contact)**: Python dictionaries in `site_data.py`
   - `get_opening_hours_for_lang(lang)` function translates "Geschlossen" to appropriate language
   - Injected into each language's config via `I18N_SUBSITES` dict in `pelicanconf.py`

### Content Organization

```
content/pages/
├── index.{lang}.md        # Homepage for each language
├── about.{lang}.md        # About page
├── faq.{lang}.md          # FAQ page
├── contact.{lang}.md      # Contact page
├── impressum.{lang}.md    # Legal notice (Impressum)
└── privacy.{lang}.md      # Privacy policy

Languages: de (German), en (English), ru (Russian), uk (Ukrainian)
```

**Content linking**: Pages with the same `Slug:` but different `Lang:` are automatically linked as translations by the i18n_subsites plugin.

### Configuration Files

- **`site_data.py`**: Single source of truth for working hours, contact info, practice info
  - Edit this file to update data across all languages
  - `OPENING_HOURS` dict uses German "Geschlossen" as canonical closed text, translated per language
  - `CLOSED_TEXT` dict provides translations for closed status

- **`pelicanconf.py`**: Development configuration
  - Disables root site generation (`INDEX_SAVE_AS = ""`, etc.)
  - Configures `I18N_SUBSITES` with per-language settings (URLs, locales, translated site data)
  - Sets up i18n_subsites plugin and Jinja2 i18n extension
  - Imports and uses `get_opening_hours_for_lang()` to inject translated data

- **`publishconf.py`**: Production configuration
  - Inherits from `pelicanconf.py`
  - Sets production `SITEURL` (https://praxis-saewska.de)
  - Updates `I18N_SUBSITES` with absolute URLs for each language

### URL Structure

Each language subsite has its own URL namespace:

```
/{lang}/                           # Homepage
/{lang}/{slug}/                    # Static pages (about, faq, contact)
/{lang}/blog/{slug}/               # Blog articles
/{lang}/blog/category/{slug}/      # Category archives
/{lang}/blog/                      # Article archives
```

Root directory (`/`) serves language detection (`.htaccess` or `_worker.js` for Cloudflare).

## Editing Content

### Update Site-Wide Data (Hours, Contact, Practice Info)

**Edit `site_data.py` only** - changes apply to all languages automatically:

```python
OPENING_HOURS = {
    'monday': '09:00 - 15:00',
    'tuesday': '12:15 – 19:00',
    # Use 'Geschlossen' for closed days (auto-translated)
    'friday': 'Geschlossen',
}

CONTACT_INFO = {
    'address_street': 'Uhlandstr. 87',
    'address_city': '10717 Berlin',
    'phone': '+49 30 12345678',
    'email': 'info@praxis-saewska.de',
}
```

After editing, rebuild: `./build.sh`

### Update Page Content

1. Open `content/pages/{page}.{lang}.md` (e.g., `about.de.md`)
2. Edit Markdown content
3. Ensure metadata is consistent:
   ```markdown
   Title: Page Title
   Lang: de
   Slug: about
   Template: about
   ```
4. **Critical**: Keep `Slug:` identical across all language versions to link translations
5. Rebuild: `./build.sh`

### Update UI Translations

1. Edit `.po` file: `themes/med_praxis/translations/{lang}/LC_MESSAGES/messages.po`
2. Add/update `msgid` and `msgstr` pairs:
   ```
   msgid "About"
   msgstr "Über uns"
   ```
3. Compile translations: `python3 scripts/compile_translations.py`
4. Rebuild: `./build.sh`

### Add New Page

1. Create files for all 4 languages: `{pagename}.de.md`, `{pagename}.en.md`, `{pagename}.ru.md`, `{pagename}.uk.md`
2. Use same `Slug:` across all versions
3. Set appropriate `Template:` (see `themes/med_praxis/templates/` for available templates)
4. Rebuild: `./build.sh`

## Theme Structure

```
themes/med_praxis/
├── templates/              # Jinja2 templates
│   ├── base.html          # Base template with language switcher
│   ├── index.html         # Homepage template
│   ├── about.html         # About page template
│   ├── faq.html           # FAQ template
│   ├── contact.html       # Contact template
│   └── ...
├── static/
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   └── ...
└── translations/           # UI string translations
    ├── de/LC_MESSAGES/messages.po
    ├── en/LC_MESSAGES/messages.po
    ├── ru/LC_MESSAGES/messages.po
    └── uk/LC_MESSAGES/messages.po
```

Templates use `{{ _('string') }}` for translatable UI strings and access site data via `{{ OPENING_HOURS }}`, `{{ CONTACT_INFO }}`, etc.

## Deployment

**Automatic deployment via GitHub Actions to Cloudflare Pages** (`.github/workflows/deploy-cloudflare.yml`):

The site uses a CI/CD pipeline that automatically builds and deploys to Cloudflare Pages on every push to `main`.

### Deployment Process

1. **Trigger**: Push to `main` branch or manually trigger workflow
2. **Build steps**:
   - Compile translations (`.po` → `.mo` files)
   - Generate Pelican site with `publishconf.py` (production config)
   - Clean up root directory (remove language-specific files that should only be in subdirectories)
   - Generate `sitemap.xml`
3. **Deploy**: Upload `output/` directory to Cloudflare Pages via API
4. **Live**: Site automatically deployed to https://praxis-saewska.de

### Build Script

The complete build process is encapsulated in `scripts/build_for_deployment.py`, which includes all steps from `build.sh`:
- Translation compilation
- Site generation
- Root cleanup
- Sitemap generation

This ensures the CI/CD build matches local development builds exactly.

### Required GitHub Secrets

Configure these in your GitHub repository settings (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN`: API token with Cloudflare Pages:Edit permissions
  - Create at: https://dash.cloudflare.com/profile/api-tokens
  - Template: "Edit Cloudflare Workers"
  
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID
  - Find at: https://dash.cloudflare.com/ (right sidebar)

### Cloudflare Pages Project Setup

1. Create Cloudflare Pages project named `praxis-saewska` (or update `projectName` in workflow)
2. Connect to GitHub repository (for preview deployments on PRs)
3. Production deployments handled by GitHub Actions workflow

### Language Detection

Cloudflare Worker (`content/_worker.js`) automatically redirects root path (`/`) to appropriate language based on visitor's `Accept-Language` header:
- Ukrainian (`uk`) speakers → `/uk/`
- Russian (`ru`) speakers → `/ru/`
- English (`en`) speakers → `/en/`
- Default/German → `/de/`

## Critical Implementation Patterns

### Adding Translated Content

- **Always create content for all 4 languages** with matching `Slug:` metadata
- Edit `site_data.py` for data that should be consistent across languages
- Edit `.po` files for UI strings that need translation
- Run `scripts/compile_translations.py` after editing `.po` files

### Modifying Configuration

- **Never edit `output/` directory** - it's deleted and regenerated on each build
- **Always use `uv`** for dependency management
- Test changes locally with development config before deploying with production config

### Translation Workflow

1. Identify string type:
   - **Site data** (hours, contact) → Edit `site_data.py`
   - **UI strings** (navigation, buttons) → Edit `.po` files
   - **Content** (page text) → Edit `.md` files for each language

2. Make changes in appropriate location
3. Compile translations if `.po` files were modified
4. Rebuild site with `./build.sh`
5. Test all 4 language versions locally

### pelicanconf.py Language Configuration

The `I18N_SUBSITES` dictionary is the heart of the multilingual system. Each language must specify:
- `SITENAME`, `SITEURL`, `LOCALE` (environment settings)
- `LANG_PREFIX` (for navigation links)
- `*_SAVE_AS` and `*_URL` patterns (enable page/article generation)
- `OPENING_HOURS`, `CONTACT_INFO`, `PRACTICE_INFO`, `CLOSED_TEXT` (translated site data)

When adding a new language, copy an existing entry and update all values accordingly.
