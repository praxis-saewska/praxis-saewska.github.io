# Build Scripts

This directory contains utility scripts for building the Praxis Saewska website.

## Scripts

### compile_translations.py

Compiles `.po` translation files to `.mo` binary files for Pelican's i18n_subsites plugin.

**Usage:**
```bash
python3 scripts/compile_translations.py
```

**What it does:**
- Finds all `.po` files in `themes/med_praxis/translations/{lang}/LC_MESSAGES/`
- Compiles each to a `.mo` binary file using `msgfmt`
- Required languages: de (German), en (English), ru (Russian), uk (Ukrainian)

**Dependencies:**
- `msgfmt` command (from gettext package)
  - macOS: `brew install gettext`
  - Linux: `sudo apt-get install gettext`

**When to run:**
- After editing any `.po` translation files
- Automatically runs as part of `./build.sh`

---

### generate_sitemap.py

Generates `sitemap.xml` for all language versions of the site.

**Usage:**
```bash
python3 scripts/generate_sitemap.py output
```

**What it does:**
- Walks through the `output/` directory after Pelican build
- Discovers all HTML pages in `/de/`, `/en/`, `/ru/`, `/uk/` directories
- Generates valid XML sitemap with proper priorities and change frequencies
- Creates `output/sitemap.xml`

**Priorities:**
- Homepage: 1.0 (weekly)
- Pages: 0.8 (monthly)
- Articles: 0.7 (monthly)
- Blog index: 0.6 (weekly)
- Categories: 0.5 (monthly)

**Features:**
- No external dependencies (uses Python stdlib only)
- Compatible with i18n_subsites multilingual setup
- Excludes tag/author pages
- Removes duplicates automatically

**When to run:**
- After Pelican generates the site
- Automatically runs as part of `./build.sh`

**Why custom script:**
The `pelican-sitemap` plugin doesn't work correctly with our multilingual setup (generates broken `/.` URLs). This custom script is specifically designed for our i18n_subsites configuration.

---

## Automatic Execution

Both scripts are automatically executed by `./build.sh`:

```bash
./build.sh
```

Build process:
1. Checks for `msgfmt` (installs if needed)
2. Compiles translations → `compile_translations.py`
3. Generates site → `pelican content -s pelicanconf.py`
4. Cleans up unnecessary files
5. Generates sitemap → `generate_sitemap.py output`

---

## Manual Execution

If you need to run scripts individually:

```bash
# Compile translations only
python3 scripts/compile_translations.py

# Generate sitemap only (after Pelican build)
uv run pelican content -s pelicanconf.py
python3 scripts/generate_sitemap.py output
```

---

## Testing

Verify scripts work correctly:

```bash
# Test translation compilation
python3 scripts/compile_translations.py
# Should output: ✓ Compiled 4 translation files

# Test sitemap generation
python3 scripts/generate_sitemap.py output
# Should output: ✓ Generated sitemap.xml with 48 URLs

# Verify sitemap is valid XML
xmllint --noout output/sitemap.xml
# No output = valid XML
```

---

## Dependencies

**Python:** 3.12+

**External tools:**
- `msgfmt` (gettext) - for translation compilation
- `xmllint` (optional) - for sitemap validation

**Python packages:**
None - scripts use only Python standard library

---

## Troubleshooting

**msgfmt not found:**
```bash
# macOS
brew install gettext

# Linux (Debian/Ubuntu)
sudo apt-get install gettext

# Linux (RHEL/CentOS)
sudo yum install gettext
```

**Sitemap not generated:**
```bash
# Check output directory exists
ls -la output/

# Run sitemap script manually
python3 scripts/generate_sitemap.py output

# Check for errors
echo $?  # Should be 0
```

**Permission denied:**
```bash
# Make sure build.sh can execute scripts
chmod +x build.sh
```

---

**Maintained by:** Project maintainers
**Last updated:** 2026-01-27
