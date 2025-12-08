# Copilot Instructions for Praxis Saewska Website

## Project Overview

**Praxis Saewska** is a **multilingual static website** for a medical practice built with **Pelican** (static site generator) and **i18n_subsites** plugin. The site generates 4 language versions (German, English, Russian, Ukrainian) from a single codebase.

## Architecture

### Build Pipeline
1. **`site_data.py`** → Central data source for working hours, contact info, practice info (auto-translated per language)
2. **Translation files** → `.po` files compiled to `.mo` files (via `compile_translations.py`)
3. **Pelican + i18n_subsites** → Generates `/de/`, `/en/`, `/ru/`, `/uk/` subdirectories
4. **`.htaccess`** → Browser-based language detection redirects `/` to appropriate language version

### Key Design Decisions
- **DEFAULT_LANG = 'en'** is "technical English" (msgid = translation). Actual English content lives in `/en/` subsite
- **German (de)** is the primary language, also gets `/de/` subsite (not root)
- **Root directory disabled** → No content generated in output root; all content in language subdirectories
- **Pelican plugin** → Uses only `i18n_subsites`, loaded from project root (not external)

## Essential Commands

```bash
# Build entire multilingual site (compile translations + generate all languages)
./build.sh

# Compile .po translation files to .mo binary files
python3 compile_translations.py

# Generate site (development configuration)
uv run pelican content -s pelicanconf.py

# Generate site (production configuration)
uv run pelican content -s publishconf.py

# Preview locally
python -m http.server 8000 -d output
# Visit: http://localhost:8000/de/, http://localhost:8000/en/, etc.

# Dependency management (uv only, never pip)
uv sync                 # Install/reinstall all dependencies
uv add <package>        # Add new package
```

## File Structure & Conventions

### Content Files
- **Pages**: `content/pages/{filename}.{lang}.md` (e.g., `about.de.md`, `about.en.md`)
- **Articles**: `content/articles/{filename}.{lang}.md`
- **Languages**: `de`, `en`, `ru`, `uk`
- **Required metadata**: `Title:`, `Lang:`, `Slug:` (slugs must match across languages to link translations)

### Configuration Files
- **`site_data.py`** → EDIT HERE for working hours, contact, practice info
- **`pelicanconf.py`** → Pelican config, i18n_subsites settings, URL patterns, theme setup
- **`themes/med_praxis/`** → Theme templates and static assets
- **`themes/med_praxis/translations/{lang}/LC_MESSAGES/messages.po`** → UI string translations

### Output Structure
```
output/
├── de/               # German site
├── en/               # English site
├── ru/               # Russian site
├── uk/               # Ukrainian site
└── theme/            # Static assets (CSS, JS, images)
```

## Updating Content

### Edit Site-Wide Data
Edit `site_data.py` for:
- **OPENING_HOURS** → Auto-translated to all 4 languages
- **CONTACT_INFO** → Applied across all language versions
- **PRACTICE_INFO** → Name, doctor, specialty
- **CLOSED_TEXT** → Translations for "closed" status

After editing, rebuild: `./build.sh`

### Edit Pages
1. Open `content/pages/{pagename}.{lang}.md`
2. Edit Markdown content
3. Rebuild: `./build.sh`

### Add/Update Translations
1. Edit `.po` file: `themes/med_praxis/translations/{lang}/LC_MESSAGES/messages.po`
2. Add/update `msgid` and `msgstr` pairs
3. Compile: `python3 compile_translations.py`
4. Rebuild: `./build.sh`

## Multilingual System Details

### Translation Flow
- **Template strings** → Wrapped in `_('string')` in Jinja2 templates
- **gettext system** → Pelican i18n extension translates at build time
- **Per-language config** → Each language in `I18N_SUBSITES` dict gets own URL patterns, opening hours translations
- **Content linking** → Pages/articles with same slug but different lang are linked as translations

### URL Patterns
Each language subsite inherits these patterns:
- `/{lang}/` → Homepage (index.html)
- `/{lang}/about/` → Static page
- `/{lang}/blog/{slug}/` → Article
- `/{lang}/blog/category/{category}/` → Category archive

### Language Detection
`.htaccess` checks `Accept-Language` header:
- `Accept-Language: de` → `/de/`
- `Accept-Language: en` → `/en/`
- `Accept-Language: ru` → `/ru/`
- `Accept-Language: uk` → `/uk/`
- Default (no match) → `/de/` (German)

## Deployment

**Automatic via GitHub Actions:**
1. Push to `main` branch
2. Workflow runs `./build.sh` and generates site
3. Output deployed to GitHub Pages

No manual deployment needed.

## Critical Implementation Patterns

### When Adding New Content
- **Always create files for all 4 languages** (de, en, ru, uk) with matching `Slug:`
- **Use consistent metadata** across language variants
- **Rebuild** with `./build.sh` to compile translations and generate output

### When Modifying Configuration
- **DO NOT** manually edit `output/` directory (deleted and regenerated)
- **Edit source files only** (content/, site_data.py, pelicanconf.py)
- **Always use `uv`** for dependencies, never `pip` or `poetry`

### Translation Strings in Templates
- String marked for translation: `{{ _('About') }}`
- Add translation to `.po` files for each language
- Compile translations: `python3 compile_translations.py`

## Testing Checklist

- [ ] `./build.sh` completes without errors
- [ ] All 4 language versions exist in `output/{de,en,ru,uk}/`
- [ ] Language switching navigation works
- [ ] Site data (hours, contact) displays correctly in all languages
- [ ] Links between languages work (translation detection)
