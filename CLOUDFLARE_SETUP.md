# Cloudflare Pages Setup Guide

This document explains how to configure Cloudflare Pages to build and deploy the Praxis Saewska multilingual website.

## Overview

The site uses Cloudflare's native build pipeline with:
- Custom build script (`cloudflare-build.sh`)
- Configuration file (`wrangler.toml`)
- Automatic deployment on git push

## Cloudflare Dashboard Configuration

### 1. Create Cloudflare Pages Project

1. Go to **Cloudflare Dashboard** → **Pages**
2. Click **Create a project**
3. Connect your GitHub/GitLab repository
4. Select `praxis-saewska.github.io` repository

### 2. Build Settings

Configure these settings during project setup:

#### Framework preset
- Select: **None** (custom build)

#### Build configuration
- **Production branch**: `main` (or your preferred branch)
- **Build command**: `./cloudflare-build.sh`
- **Build output directory**: `output`
- **Root directory**: (leave empty)

#### Environment variables

Add these variables in **Settings** → **Environment variables**:

| Variable | Value | Description |
|----------|-------|-------------|
| `PYTHON_VERSION` | `3.12` | Python version for build |
| `UV_VERSION` | `latest` | UV package manager version |

### 3. Custom Domain (Optional)

If using a custom domain:

1. Go to **Pages** → **Your Project** → **Custom domains**
2. Add `praxis-saewska.de` and `www.praxis-saewska.de`
3. Follow Cloudflare's DNS configuration instructions

## Build Process Details

The `cloudflare-build.sh` script runs in Cloudflare's Ubuntu build environment and performs:

### Step 1: Install System Dependencies
```bash
apt-get update && apt-get install -y gettext
```
Installs `msgfmt` tool needed to compile `.po` translation files.

### Step 2: Install Python Dependencies
```bash
uv sync
```
Installs Pelican and all dependencies from `pyproject.toml` lockfile.

### Step 3: Compile Translations
```bash
uv run python scripts/compile_translations.py
```
Compiles `.po` translation files to `.mo` binary files for all 4 languages (de, en, ru, uk).

### Step 4: Generate Site
```bash
uv run pelican content -s publishconf.py
```
Generates the complete multilingual site using production configuration.

### Step 5: Clean Root Directory
```bash
# Remove unnecessary files from output root
find output/pages -name "*.html" -delete
find output -maxdepth 1 -name "*-*.html" -delete
```
Ensures clean URL structure - pages only exist in language subdirectories (`/de/`, `/en/`, `/ru/`, `/uk/`).

### Step 6: Generate Sitemap
```bash
uv run python scripts/generate_sitemap.py output
```
Creates `sitemap.xml` with all language pages.

## Deployment Workflow

### Automatic Deployment
1. Developer pushes to `main` branch
2. Cloudflare detects commit via webhook
3. Triggers build in Ubuntu container
4. Runs `cloudflare-build.sh`
5. Deploys `output/` directory to edge network
6. Site available globally within seconds

### Manual Deployment
You can also trigger deployments manually:
- From Cloudflare Dashboard: **Pages** → **Your Project** → **Deployments** → **Retry deployment**
- Or use GitHub Actions workflow: `.github/workflows/cloudflare-pages.yml` (manual trigger)

## Troubleshooting

### Build fails with "msgfmt: command not found"
**Cause**: gettext not installed
**Solution**: Ensure `cloudflare-build.sh` includes:
```bash
apt-get update && apt-get install -y gettext
```

### Build fails with "uv: command not found"
**Cause**: UV not pre-installed in build environment
**Solution**: Check Cloudflare's build image. May need to install UV manually:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.cargo/bin:$PATH"
```

### Pages missing or wrong language shown
**Cause**: Root directory cleanup didn't run
**Solution**: Verify `cloudflare-build.sh` includes cleanup step (step 5)

### Translations not working
**Cause**: `.mo` files not generated
**Solution**: Check build logs for `compile_translations.py` output. Ensure all `.po` files are valid.

## Local Testing of Build Script

Test the Cloudflare build process locally:

```bash
# Simulate Cloudflare environment (Ubuntu/Debian)
docker run -it --rm -v $(pwd):/app -w /app ubuntu:22.04 bash

# Inside container:
apt-get update && apt-get install -y gettext curl python3 python3-pip
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.cargo/bin:$PATH"

# Run build script
./cloudflare-build.sh

# Check output
ls -la output/
```

## Differences from Local Build

| Aspect | Local (`build.sh`) | Cloudflare (`cloudflare-build.sh`) |
|--------|-------------------|-----------------------------------|
| Environment | macOS/Linux dev machine | Ubuntu container |
| Dependencies | Assumes gettext installed | Installs gettext via apt-get |
| Python | Uses system or `.venv` | Always uses `uv run` |
| Config | `pelicanconf.py` (dev) | `publishconf.py` (production) |
| `.mo` files | Optional (can be committed) | Always generated fresh |

## Monitoring

Monitor deployments in Cloudflare Dashboard:
- **Pages** → **Your Project** → **Deployments**
- View build logs, deploy status, and traffic analytics
- Set up notifications for failed builds

## Cost

Cloudflare Pages free tier includes:
- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- 1 concurrent build

This is more than sufficient for a medical practice website.

## Security

Cloudflare provides automatic:
- DDoS protection
- Free SSL/TLS certificates
- Web Application Firewall (WAF)
- Bot protection

No additional configuration needed.

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Build Pipeline](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [UV Package Manager](https://docs.astral.sh/uv/)
- [Pelican Documentation](https://docs.getpelican.com/)
