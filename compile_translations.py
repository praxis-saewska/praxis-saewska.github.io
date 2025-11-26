#!/usr/bin/env python3
"""
Compile .po translation files to .mo binary files for Pelican i18n_subsites
"""
import os
import subprocess
import sys

def compile_translations():
    """Compile all .po files to .mo files"""
    base_dir = os.path.dirname(__file__)
    translations_dir = os.path.join(base_dir, 'themes', 'custom', 'translations')
    
    languages = ['de', 'en', 'ru', 'uk']
    compiled = 0
    errors = []
    
    for lang in languages:
        po_file = os.path.join(translations_dir, lang, 'LC_MESSAGES', 'messages.po')
        mo_file = os.path.join(translations_dir, lang, 'LC_MESSAGES', 'messages.mo')
        
        if not os.path.exists(po_file):
            print(f"Warning: {po_file} not found, skipping...")
            continue
        
        try:
            # Use msgfmt to compile .po to .mo
            result = subprocess.run(
                ['msgfmt', '-o', mo_file, po_file],
                capture_output=True,
                text=True,
                check=True
            )
            print(f"✓ Compiled {lang}/LC_MESSAGES/messages.po -> messages.mo")
            compiled += 1
        except subprocess.CalledProcessError as e:
            error_msg = f"Error compiling {lang}: {e.stderr}"
            errors.append(error_msg)
            print(f"✗ {error_msg}")
        except FileNotFoundError:
            print("Error: 'msgfmt' command not found. Please install gettext tools:")
            print("  - macOS: brew install gettext")
            print("  - Linux: sudo apt-get install gettext")
            print("  - Windows: Install gettext from https://mlocati.github.io/articles/gettext-iconv-windows.html")
            sys.exit(1)
    
    print(f"\nCompiled {compiled}/{len(languages)} translation files")
    if errors:
        print("\nErrors:")
        for error in errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("All translations compiled successfully!")

if __name__ == '__main__':
    compile_translations()

