#!/usr/bin/env python3
"""
Compile .po translation files to .mo binary files using polib
"""

import os
import sys

import polib


def compile_translations():
    """Compile all .po files to .mo files"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    translations_dir = os.path.join(
        project_root, "themes", "med_praxis", "translations"
    )

    languages = ["de", "en", "ru", "uk"]
    compiled = 0

    for lang in languages:
        po_file = os.path.join(translations_dir, lang, "LC_MESSAGES", "messages.po")
        mo_file = os.path.join(translations_dir, lang, "LC_MESSAGES", "messages.mo")

        if not os.path.exists(po_file):
            print(f"⚠️  {po_file} not found, skipping...")
            continue

        try:
            po = polib.pofile(po_file)
            po.save_as_mofile(mo_file)
            print(f"✓ Compiled {lang}/LC_MESSAGES/messages.po -> messages.mo")
            compiled += 1
        except Exception as e:
            print(f"✗ Error compiling {lang}: {e}")
            sys.exit(1)

    print(f"\n✅ Compiled {compiled}/{len(languages)} translation files")


if __name__ == "__main__":
    compile_translations()
