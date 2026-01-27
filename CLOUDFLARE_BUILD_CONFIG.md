# Cloudflare Pages Build Configuration

This document contains the exact configuration needed for Cloudflare Pages native Git integration.

## Problem Solved

The original build required the system `msgfmt` command (from gettext package), which isn't available in Cloudflare's build environment. The solution uses `polib`, a pure Python library, to compile translations without system dependencies.

## Cloudflare Pages Dashboard Configuration

Navigate to your Cloudflare Pages project settings and configure:

### Framework Preset
```
None
```

### Build Command
```bash
pip install uv && uv sync && python scripts/build_for_deployment.py
```

### Build Output Directory
```
output
```

### Root Directory
```
/
```
(leave empty or use `/`)

### Environment Variables
```
PYTHON_VERSION=3.12
```

## What the Build Does

The build command executes these steps automatically:

1. **Install uv** - Fast Python package manager
2. **Install dependencies** - All packages from `pyproject.toml` including `polib`
3. **Run build script** (`scripts/build_for_deployment.py`):
   - ✅ Compile translations (`.po` → `.mo`) using `polib` (no system gettext needed)
   - ✅ Generate Pelican site with production config
   - ✅ Clean up root directory (remove language-specific files)
   - ✅ Generate `sitemap.xml`

## Changes Made

### 1. Added `polib` dependency
**File**: `pyproject.toml`
```python
dependencies = [
    "pelican>=4.9.0",
    "markdown>=3.5.0",
    "typogrify>=2.0.7",
    "pelican-i18n-subsites>=1.0.0",
    "polib>=1.2.0",  # ← Added for pure Python .po → .mo compilation
]
```

### 2. Rewrote translation compiler
**File**: `scripts/compile_translations.py`
- **Before**: Used system `msgfmt` command (requires gettext installation)
- **After**: Uses `polib` Python library (pure Python, no system deps)

### 3. Created unified build script
**File**: `scripts/build_for_deployment.py`
- Combines all build steps from `build.sh`
- Works identically in local dev and CI/CD environments
- No system dependencies required

## Testing Locally

Before pushing, test the build locally:

```bash
# Install dependencies
uv sync

# Run the build script
python scripts/build_for_deployment.py

# Preview
python -m http.server 8000 -d output
```

## Deployment Flow

```
Push to GitHub main branch
        ↓
Cloudflare detects push (webhook)
        ↓
Cloudflare runs build command
        ↓
Install uv → Install deps → Run build script
        ↓
Deploy to Cloudflare edge network
        ↓
Live at https://praxis-saewska.de
```

## Preview Deployments

Cloudflare automatically creates preview deployments for pull requests:
- Format: `https://<branch-name>.praxis-saewska.pages.dev`
- Updates automatically on each push to PR
- Perfect for testing before merging

## Monitoring

View build logs and deployment status:
1. Go to Cloudflare Dashboard
2. Navigate to **Workers & Pages**
3. Click your project (`praxis-saewska`)
4. Click **"View build log"** for any deployment

## Troubleshooting

### Build fails with "polib not found"
- Ensure `polib>=1.2.0` is in `pyproject.toml` dependencies
- Run `uv sync` locally to update lockfile
- Commit and push `uv.lock` file

### Build fails with "scripts not found"
- Ensure `scripts/` directory is committed to git
- Check that `build_for_deployment.py` and `compile_translations.py` exist

### Translations not working
- Verify `.po` files exist in `themes/med_praxis/translations/{lang}/LC_MESSAGES/`
- Check build logs to confirm translation compilation step succeeded
- Ensure `.mo` files are being generated (visible in build logs)

### Site generates but pages are missing
- Check `publishconf.py` configuration
- Verify all language subdirectories are being created
- Review cleanup step in build logs

## Alternative: GitHub Actions

If you prefer more control, a GitHub Actions workflow is also available in `.github/workflows/deploy-cloudflare.yml`. See `DEPLOYMENT_SETUP.md` for configuration.

## Summary

✅ **No system dependencies** - Pure Python solution  
✅ **Cloudflare native** - Direct Git integration  
✅ **Automatic deployments** - Push to main = deploy  
✅ **Preview on PRs** - Test before merging  
✅ **Fast builds** - Cloudflare's optimized environment  
✅ **Simple maintenance** - Single build command  
