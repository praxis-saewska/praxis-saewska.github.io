#!/bin/bash
# Build script for Praxis Saewska website

set -e  # Exit on error

echo "🏗️  Building Praxis Saewska multilingual website..."
echo ""

# Activate virtual environment
source .venv/bin/activate

# Compile translations
echo "📚 Compiling translations..."
python3 compile_translations.py
echo ""

# Generate site
echo "⚙️  Generating site..."
pelican content -s pelicanconf.py
echo ""

echo "✅ Build complete! Site generated in output/"
echo ""
echo "📁 Structure:"
echo "  /de/ - 🇩🇪 German site (main language)"
echo "  /en/ - 🇬🇧 English site"
echo "  /ru/ - 🇷🇺 Russian site"
echo "  /uk/ - 🇺🇦 Ukrainian site"
echo ""
echo "🌐 .htaccess will redirect / to appropriate language based on browser settings"
echo "   Default: /de/ (German)"
echo ""
echo "💡 To test locally:"
echo "   python -m http.server 8000 -d output"
echo "   Then open http://localhost:8000/de/"

