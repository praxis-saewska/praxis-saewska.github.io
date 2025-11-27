# Troubleshooting Pelican Errors

## Common Errors and Solutions

### 1. "Unable to watch path '/content/images' as it does not exist"

**Solution:** Ensure the `content/images/` directory exists and contains image files:
```bash
mkdir -p content/images
cp -r themes/med_praxis/static/images/* content/images/
```

### 2. "Unable to find `/site.webmanifest` or variations"

**Solution:** Ensure static files are in the `content/` directory:
```bash
cp site.webmanifest content/
cp robots.txt content/
cp sitemap.xml content/
cp CNAME content/
```

### 3. "Unable to find `/ru/faq` or variations" (in reload mode)

**Explanation:** This error appears when using `pelican -lr` (reload mode). Pelican's reload server tries to find pages that haven't been generated yet. This is **normal behavior** and not a critical error.

**Solution:** 
- Ignore this error - it's harmless in development mode
- The pages will be available after generation completes
- Use `pelican content -s pelicanconf.py` (without `-lr`) to generate without reload mode

### 4. "A problem occurred copying file" warnings

**Solution:** These warnings usually occur when:
- Files in `STATIC_PATHS` don't exist in `content/`
- File permissions are incorrect

Ensure all files listed in `STATIC_PATHS` exist in the `content/` directory.

### 5. "There are 2 original (not translated) items" warning

**Explanation:** This warning appears when Pelican detects multiple language versions of the same content. This is **normal** for multilingual sites.

**Solution:** This warning can be safely ignored - it's just Pelican detecting language variants.

## Quick Fix Checklist

1. ✅ Ensure `content/images/` exists and contains images
2. ✅ Copy static files to `content/`:
   - `site.webmanifest`
   - `robots.txt`
   - `sitemap.xml`
   - `CNAME`
3. ✅ Verify `STATIC_PATHS` in `pelicanconf.py` matches files in `content/`
4. ✅ Ignore reload mode errors (`/ru/faq`, etc.) - they're harmless

## Testing Without Errors

For clean generation without reload mode errors:

```bash
# Generate site (no reload)
uv run pelican content -s pelicanconf.py

# Then start server separately
cd output && python3 -m http.server 8000
```

For development with auto-reload (may show harmless errors):

```bash
# Generate with auto-reload (may show /ru/faq errors - ignore them)
uv run pelican content -s pelicanconf.py -lr
```

