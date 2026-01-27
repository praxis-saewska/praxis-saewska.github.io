#!/bin/bash
# Build script for Praxis Saewska website

set -e  # Exit on error

echo "🏗️  Building Praxis Saewska multilingual website..."
echo ""

# Check for msgfmt and install if needed
check_msgfmt() {
    if ! command -v msgfmt &> /dev/null; then
        echo "⚠️  msgfmt not found. Attempting to install gettext..."
        
        # Detect OS and install accordingly
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew &> /dev/null; then
                echo "📦 Installing gettext via Homebrew..."
                brew install gettext
                # Add gettext to PATH if needed
                if [ -d "/opt/homebrew/opt/gettext/bin" ]; then
                    export PATH="/opt/homebrew/opt/gettext/bin:$PATH"
                elif [ -d "/usr/local/opt/gettext/bin" ]; then
                    export PATH="/usr/local/opt/gettext/bin:$PATH"
                fi
            else
                echo "❌ Homebrew not found. Please install gettext manually:"
                echo "   brew install gettext"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            if command -v apt-get &> /dev/null; then
                echo "📦 Installing gettext via apt-get..."
                sudo apt-get update && sudo apt-get install -y gettext
            elif command -v yum &> /dev/null; then
                echo "📦 Installing gettext via yum..."
                sudo yum install -y gettext
            elif command -v dnf &> /dev/null; then
                echo "📦 Installing gettext via dnf..."
                sudo dnf install -y gettext
            else
                echo "❌ Package manager not found. Please install gettext manually:"
                echo "   sudo apt-get install gettext  # Debian/Ubuntu"
                echo "   sudo yum install gettext      # RHEL/CentOS"
                exit 1
            fi
        else
            echo "❌ Unsupported OS. Please install gettext manually:"
            echo "   macOS: brew install gettext"
            echo "   Linux: sudo apt-get install gettext"
            exit 1
        fi
        
        # Verify installation
        if ! command -v msgfmt &> /dev/null; then
            echo "❌ msgfmt still not found after installation attempt."
            echo "   Please install gettext manually and try again."
            exit 1
        fi
        
        echo "✅ msgfmt installed successfully!"
        echo ""
    else
        echo "✅ msgfmt found"
    fi
}

# Check and install msgfmt if needed
check_msgfmt
echo ""

# Activate virtual environment and set up Python commands
if [ -d ".venv" ]; then
    source .venv/bin/activate
    PYTHON_CMD="python3"
    PELICAN_CMD="pelican"
elif command -v uv &> /dev/null; then
    echo "📦 Using uv for Python environment..."
    PYTHON_CMD="uv run python"
    PELICAN_CMD="uv run pelican"
else
    echo "⚠️  Warning: No virtual environment found. Using system Python."
    PYTHON_CMD="python3"
    PELICAN_CMD="pelican"
fi

# Compile translations
echo "📚 Compiling translations..."
$PYTHON_CMD scripts/compile_translations.py
echo ""

# Generate site
echo "⚙️  Generating site..."
$PELICAN_CMD content -s pelicanconf.py
echo ""

# Clean up files that shouldn't be in root (they should only be in language subdirectories)
echo "🧹 Cleaning up unnecessary files from output root..."
DEFAULT_LANG="C"
# Remove ALL page files from output/pages (they should only be in /de/, /en/, /ru/, /uk/)
if [ -d "output/pages" ]; then
    find output/pages -name "*.html" -delete 2>/dev/null || true
    # Remove pages directory if empty
    rmdir output/pages 2>/dev/null || true
fi
# Remove article files for DEFAULT_LANG from root
find output -maxdepth 1 -name "*-${DEFAULT_LANG}.html" -delete 2>/dev/null || true
# Remove any language-specific article files from root (they should only be in subdirectories)
for lang in de en ru uk; do
    find output -maxdepth 1 -name "*-${lang}.html" -delete 2>/dev/null || true
done
echo "✅ Cleanup complete"
echo ""

# Generate sitemap
echo "🗺️  Generating sitemap..."
$PYTHON_CMD scripts/generate_sitemap.py output
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

