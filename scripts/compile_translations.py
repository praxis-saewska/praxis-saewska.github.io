#!/usr/bin/env python3
"""
Compile .po translation files to .mo binary files for Pelican i18n_subsites
Uses polib (pure Python) instead of system msgfmt for cross-platform compatibility
"""

import os
import sys
from pathlib import Path

try:
    import polib
except ImportError:
    print("Error: polib not found. Please install it:")
    print("  pip install polib")
    print("  or: uv add polib")
    sys.exit(1)


def compile_translations():
    """Compile all .po files to .mo files using polib"""
    # Get project root (parent of scripts directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    translations_dir = project_root / "themes" / "med_praxis" / "translations"

    languages = ["de", "en", "ru", "uk"]
    compiled = 0
    errors = []

    print("Compiling translation files (.po → .mo)...")
    print("-" * 50)

    for lang in languages:
        po_file = translations_dir / lang / "LC_MESSAGES" / "messages.po"
        mo_file = translations_dir / lang / "LC_MESSAGES" / "messages.mo"

        if not po_file.exists():
            print(f"⚠️  Warning: {po_file} not found, skipping...")
            continue

        try:
            # Load .po file
            po = polib.pofile(str(po_file))

            # Save as .mo file
            po.save_as_mofile(str(mo_file))

            print(f"✅ Compiled {lang}/LC_MESSAGES/messages.po → messages.mo")
            compiled += 1

        except Exception as e:
            error_msg = f"Error compiling {lang}: {str(e)}"
            errors.append(error_msg)
            print(f"❌ {error_msg}")

    print("-" * 50)
    print(f"Compiled {compiled}/{len(languages)} translation files")

    if errors:
        print("\n❌ Errors occurred:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("✅ All translations compiled successfully!")
        return True


if __name__ == "__main__":
