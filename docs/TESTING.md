# Testing Pelican Generated Site

## Quick Start

### 1. Generate the site (development mode)

```bash
uv run pelican content -s pelicanconf.py
```

This generates the site to the `output/` directory with relative URLs (good for local testing).

**Note:** If you see warnings about "original (not translated) items", this is normal - it's just Pelican detecting language variants of the same content.

### 2. Generate the site (production mode)

```bash
uv run pelican content -s publishconf.py
```

This generates the site with production URLs (`https://praxis-saewska.de`).

### 3. Preview locally

After generating, start a local web server:

```bash
cd output && python -m http.server 8000
```

Or using Python 3:

```bash
cd output && python3 -m http.server 8000
```

Then open your browser and visit:
- `http://localhost:8000` - German version (default)
- `http://localhost:8000/en/` - English version
- `http://localhost:8000/ru/` - Russian version
- `http://localhost:8000/ua/` - Ukrainian version

### 4. Auto-regenerate on file changes (development)

For automatic regeneration when files change:

```bash
uv run pelican content -s pelicanconf.py -lr
```

This will:
- `-l` (--listen): Start a local web server
- `-r` (--reload): Auto-reload on file changes

The site will be available at `http://localhost:8000`

### 5. Check for errors

Pelican will output warnings and errors during generation. Common issues:

- **Missing files**: Check that all static files are in `themes/med_praxis/static/`
- **Template errors**: Check Jinja2 syntax in templates
- **Markdown errors**: Check metadata format in `.md` files
- **Missing translations**: Ensure all language versions exist

### 6. Validate generated HTML

You can validate the generated HTML using online validators or tools like:

```bash
# Install html5validator if needed
pip install html5validator

# Validate all HTML files
html5validator --root output/
```

### 7. Test all language versions

After generation, check that all language subsites are generated:

```bash
ls -la output/
ls -la output/en/
ls -la output/ru/
ls -la output/ua/
```

Each should have:
- `index.html` (homepage)
- `about/` directory
- `faq/` directory
- `privacy/` directory
- `impressum/` directory

### 8. Test JavaScript functionality

1. Open the site in a browser
2. Test language switcher
3. Test cookie consent banner
4. Test FAQ accordion
5. Test mobile menu
6. Test Google Maps (if cookies accepted)

### 9. Check console for errors

Open browser developer tools (F12) and check:
- Console for JavaScript errors
- Network tab for missing resources (404 errors)
- Elements tab for correct HTML structure

## Troubleshooting

### Site not generating

- Check that all dependencies are installed: `uv sync`
- Verify Pelican is installed: `uv run pelican --version`
- Check for syntax errors in `pelicanconf.py`

### Missing static files

- Ensure files are in `themes/med_praxis/static/`
- Check `STATIC_PATHS` in `pelicanconf.py`
- Verify `THEME_STATIC_DIR = 'theme'` is set

### Language subsites not generating

- Verify `I18N_SUBSITES` is configured in `pelicanconf.py`
- Check that content files have correct `Lang:` metadata
- Ensure files are named correctly (e.g., `index.de.md`, `index.en.md`)

### URLs not working

- For local testing, use `pelicanconf.py` (relative URLs)
- For production, use `publishconf.py` (absolute URLs)
- Check `SITEURL` setting matches your deployment

