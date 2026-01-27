# Cloudflare Pages Deployment Setup Guide

This guide walks you through setting up automated deployment to Cloudflare Pages via GitHub Actions.

## Prerequisites

- GitHub repository with your Pelican site
- Cloudflare account
- Access to GitHub repository settings

## Step 1: Create Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use the **"Edit Cloudflare Workers"** template (or create custom token)
4. Configure permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
5. Set **Account Resources**:
   - Include → Your account
6. Click **"Continue to summary"**
7. Click **"Create Token"**
8. **Copy the token** (you won't see it again!)

## Step 2: Get Cloudflare Account ID

1. Go to https://dash.cloudflare.com/
2. Look at the right sidebar - you'll see **"Account ID"**
3. Copy the Account ID

## Step 3: Create Cloudflare Pages Project

1. Go to https://dash.cloudflare.com/
2. Click **"Workers & Pages"** in the left sidebar
3. Click **"Create application"** → **"Pages"** → **"Connect to Git"**
4. Select your GitHub repository
5. Configure build settings:
   - **Project name**: `praxis-saewska` (or update workflow file)
   - **Production branch**: `main`
   - **Build command**: Leave empty (GitHub Actions handles this)
   - **Build output directory**: `output`
6. Click **"Save and Deploy"**
7. **Cancel the first build** (GitHub Actions will handle deployments)

### Alternative: Create Project via API

The GitHub Actions workflow will automatically create the project if it doesn't exist, using the `projectName` specified in the workflow file.

## Step 4: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add two secrets:

### Secret 1: CLOUDFLARE_API_TOKEN
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Value**: Paste the API token from Step 1

### Secret 2: CLOUDFLARE_ACCOUNT_ID
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: Paste the Account ID from Step 2

## Step 5: Configure Custom Domain (Optional)

If you want to use `praxis-saewska.de` instead of `praxis-saewska.pages.dev`:

1. Go to your Cloudflare Pages project
2. Click **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Enter `praxis-saewska.de`
5. Follow DNS configuration instructions
6. Wait for SSL certificate provisioning (automatic)

## Step 6: Test Deployment

1. Make a commit to the `main` branch
2. Push to GitHub
3. Go to **Actions** tab in your GitHub repository
4. Watch the "Deploy to Cloudflare Pages" workflow run
5. Once complete, visit your site at:
   - Custom domain: https://praxis-saewska.de
   - Or Cloudflare subdomain: https://praxis-saewska.pages.dev

## Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy-cloudflare.yml`) automatically:

1. ✅ Compiles translations (`.po` → `.mo`)
2. ✅ Generates Pelican site (production config)
3. ✅ Cleans up root directory
4. ✅ Generates sitemap
5. ✅ Deploys to Cloudflare Pages

All the build steps from `build.sh` are included, so your deployed site matches your local development environment exactly.

## Troubleshooting

### "API token not found" error
- Verify `CLOUDFLARE_API_TOKEN` is correctly set in GitHub Secrets
- Check token permissions include "Cloudflare Pages → Edit"

### "Account ID not found" error
- Verify `CLOUDFLARE_ACCOUNT_ID` is correctly set in GitHub Secrets
- Ensure the Account ID matches your Cloudflare account

### "Project not found" error
- Create the Cloudflare Pages project manually (Step 3)
- Or ensure `projectName` in workflow matches your project name

### Build fails
- Check GitHub Actions logs for detailed error messages
- Ensure all dependencies in `pyproject.toml` are up to date
- Test the build locally with `./build.sh`

## Preview Deployments

Every pull request automatically gets a preview deployment URL:
- Format: `https://<branch-name>.praxis-saewska.pages.dev`
- Allows testing changes before merging to `main`

## Monitoring

View deployment history:
- **GitHub**: Actions tab shows workflow runs
- **Cloudflare**: Pages project shows deployment history and analytics

## Local Testing

Before pushing, always test locally:

```bash
# Build the site
./build.sh

# Preview locally
python -m http.server 8000 -d output

# Test all language versions
open http://localhost:8000/de/
open http://localhost:8000/en/
open http://localhost:8000/ru/
open http://localhost:8000/uk/
```
