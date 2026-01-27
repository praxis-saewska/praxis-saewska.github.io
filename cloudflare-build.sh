#!/bin/bash
# Cloudflare build script for Praxis Saewska website
# This script runs during Cloudflare Pages build process

set -e  # Exit on error

echo "🏗️  Building Praxis Saewska for Cloudflare Pages..."
echo ""

# Install system dependencies (gettext for msgfmt)
echo "📦 Installing gettext..."
apt-get update && apt-get install -y gettext
echo ""

# Install Python dependencies using uv
echo "📦 Installing Python dependencies..."
uv sync
echo ""

# Compile translations
echo "📚 Compiling translations..."
uv run python scripts/compile_translations.py
echo ""

# Generate site with production config
echo "⚙️  Generating site..."
uv run pelican content -s publishconf.py
echo ""

# Clean up files that shouldn't be in root
echo "🧹 Cleaning up unnecessary files from output root..."
DEFAULT_LANG="C"

# Remove ALL page files from output/pages (they should only be in /de/, /en/, /ru/, /uk/)
if [ -d "output/pages" ]; then
    find output/pages -name "*.html" -delete 2>/dev/null || true
    rmdir output/pages 2>/dev/null || true
fi

# Remove article files for DEFAULT_LANG from root
find output -maxdepth 1 -name "*-${DEFAULT_LANG}.html" -delete 2>/dev/null || true

# Remove any language-specific article files from root
for lang in de en ru uk; do
    find output -maxdepth 1 -name "*-${lang}.html" -delete 2>/dev/null || true
done

echo "✅ Cleanup complete"
echo ""

# Generate sitemap
echo "🗺️  Generating sitemap..."
uv run python scripts/generate_sitemap.py output
echo ""

echo "✅ Build complete! Site generated in output/"
echo ""
echo "📁 Structure:"
echo "  /de/ - 🇩🇪 German site (main language)"
echo "  /en/ - 🇬🇧 English site"
echo "  /ru/ - 🇷🇺 Russian site"
echo "  /uk/ - 🇺🇦 Ukrainian site"
