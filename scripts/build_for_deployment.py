#!/usr/bin/env python3
"""
Complete build script for Praxis Saewska website deployment
Incorporates all steps from build.sh:
1. Compile translations (.po to .mo)
2. Generate Pelican site
3. Clean up root directory (remove language-specific files)
4. Generate sitemap
"""

import subprocess
import sys
from pathlib import Path


def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n{'=' * 60}")
    print(f"🔨 {description}")
    print(f"{'=' * 60}")

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.stdout:
        print(result.stdout)

    if result.returncode != 0:
        print(f"❌ Error: {description} failed")
        if result.stderr:
            print(result.stderr)
        return False

    print(f"✅ {description} completed")
    return True


def clean_output_root(output_dir="output"):
    """Clean up unnecessary files from output root directory"""
    print(f"\n{'=' * 60}")
    print("🧹 Cleaning up output root directory")
    print(f"{'=' * 60}")

    output_path = Path(output_dir)

    if not output_path.exists():
        print(f"⚠️  Output directory {output_dir} does not exist yet")
        return True

    # Remove ALL page files from output/pages (they should only be in /de/, /en/, /ru/, /uk/)
    pages_dir = output_path / "pages"
    if pages_dir.exists():
        html_files = list(pages_dir.glob("*.html"))
        for html_file in html_files:
            html_file.unlink()
            print(f"  Removed: {html_file.relative_to(output_path)}")

        # Remove pages directory if empty
        try:
            pages_dir.rmdir()
            print("  Removed empty directory: pages/")
        except OSError:
            pass  # Directory not empty, that's ok

    # Remove language-specific article files from root
    DEFAULT_LANG = "C"
    languages = ["de", "en", "ru", "uk", DEFAULT_LANG]

    removed_count = 0
    for lang in languages:
        pattern = f"*-{lang}.html"
        for html_file in output_path.glob(pattern):
            if html_file.is_file() and html_file.parent == output_path:
                html_file.unlink()
                print(f"  Removed: {html_file.name}")
                removed_count += 1

    print(f"✅ Cleaned up {removed_count} unnecessary files from root")
    return True


def main():
    """Main build process"""
    print("\n" + "=" * 60)
    print("🏗️  Building Praxis Saewska Multilingual Website")
    print("=" * 60)

    # Get project root (parent of scripts directory)
    project_root = Path(__file__).parent.parent

    # Step 1: Compile translations
    if not run_command(
        f"python3 {project_root}/scripts/compile_translations.py",
        "Compiling translations (.po → .mo)",
    ):
        sys.exit(1)

    # Step 2: Generate Pelican site (using publishconf.py for production)
    if not run_command(
        f"pelican {project_root}/content -s {project_root}/publishconf.py",
        "Generating Pelican site (production config)",
    ):
        sys.exit(1)

    # Step 3: Clean up output root
    if not clean_output_root(project_root / "output"):
        sys.exit(1)

    # Step 4: Generate sitemap
    if not run_command(
        f"python3 {project_root}/scripts/generate_sitemap.py {project_root}/output",
        "Generating sitemap.xml",
    ):
        sys.exit(1)

    # Final summary
    print("\n" + "=" * 60)
    print("✅ Build Complete!")
    print("=" * 60)
    print("\n📁 Generated structure:")
    print("  /de/ - 🇩🇪 German site (main language)")
    print("  /en/ - 🇬🇧 English site")
    print("  /ru/ - 🇷🇺 Russian site")
    print("  /uk/ - 🇺🇦 Ukrainian site")
    print("  /_worker.js - Cloudflare Worker for language detection")
    print("  /sitemap.xml - Search engine sitemap")
    print("\n🚀 Ready for deployment to Cloudflare Pages!")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
