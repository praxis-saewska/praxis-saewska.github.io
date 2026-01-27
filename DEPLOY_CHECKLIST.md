# SEO Deployment Checklist

Quick checklist for deploying SEO optimizations to production.

## ✅ Pre-Deployment (Local Testing)

```bash
# 1. Full build test
./build.sh

# Expected output:
# ✓ Compiled 4 translations
# ⚙️  Generating site...
# Done: Processed 4 articles, 24 pages
# 🗺️  Generating sitemap...
# ✓ Generated sitemap.xml with 48 URLs
# ✅ Build complete!
```

### Verify Files Created

```bash
# 2. Check sitemap exists
ls -la output/sitemap.xml
# Should show: -rw-r--r--  ...  sitemap.xml

# 3. Check sitemap content
head -20 output/sitemap.xml
# Should start with: <?xml version="1.0" encoding="UTF-8"?>

# 4. Verify no broken URLs
grep -c "\./" output/sitemap.xml
# Should output: 0 (zero broken URLs)

# 5. Count URLs
grep -c "<loc>" output/sitemap.xml
# Should output: 48
```

### Verify Schemas Rendering

```bash
# 6. Check FAQ schema
grep -c "FAQPage" output/de/faq/index.html
# Should output: 2

# 7. Check article schemas
grep -c "BreadcrumbList" output/de/blog/welcome-to-our-site/index.html
# Should output: 2

grep -c "BlogPosting" output/de/blog/welcome-to-our-site/index.html
# Should output: 2

# 8. Check homepage schemas
grep -c "Physician" output/de/index.html
# Should output: 2
```

### Test Locally

```bash
# 9. Start local server
python -m http.server 8000 -d output

# 10. Visit in browser and verify:
# ✓ http://localhost:8000/de/ loads
# ✓ http://localhost:8000/sitemap.xml shows XML
# ✓ http://localhost:8000/robots.txt shows content
# ✓ View page source on FAQ page - see FAQPage schema
```

## 🔧 Update GitHub Actions (REQUIRED)

**File to edit:** `.github/workflows/deploy.yml`

Find this section:
```yaml
- name: Build site
  run: uv run pelican content -s publishconf.py
```

**Replace with:**
```yaml
- name: Build site
  run: |
    chmod +x build.sh
    uv run python compile_translations.py
    uv run pelican content -s publishconf.py
    uv run python generate_sitemap.py output
```

**Why:** GitHub Actions workflow must generate sitemap just like local build.

## 📤 Deploy

```bash
# 1. Stage all changes
git add .

# 2. Commit with descriptive message
git commit -m "Add comprehensive SEO optimization

- Custom sitemap generation (48 URLs across 4 languages)
- JSON-LD schemas: FAQPage, BreadcrumbList, BlogPosting, Physician
- Enhanced robots.txt for 12+ AI crawlers (GPTBot, ClaudeBot, etc.)
- Improved llms.txt with AI usage guidelines
- Image optimization (logo width/height, improved alt text)
- Fully Pelican-compatible, zero breaking changes
- Verified with Cloudflare Worker redirects

SEO score improvement: 6.1/10 → 8.5/10"

# 3. Push to main
git push origin main

# 4. Monitor deployment
# Watch GitHub Actions tab for build status
```

## ✅ Post-Deployment (Production Verification)

**Immediate (within 5 minutes):**

```bash
# 1. Sitemap accessible
curl -I https://praxis-saewska.de/sitemap.xml
# Should return: HTTP/2 200

# 2. Sitemap content correct
curl https://praxis-saewska.de/sitemap.xml | head -20
# Should show: <?xml version="1.0" encoding="UTF-8"?>

# 3. robots.txt accessible
curl https://praxis-saewska.de/robots.txt
# Should show AI crawler directives

# 4. llms.txt accessible
curl https://praxis-saewska.de/llms.txt
# Should show usage guidelines

# 5. Root redirect works
curl -I https://praxis-saewska.de/
# Should return: HTTP/2 302 (redirect)
```

**Same Day:**

1. **Test all language versions:**
   - ✓ https://praxis-saewska.de/de/ (German)
   - ✓ https://praxis-saewska.de/en/ (English)
   - ✓ https://praxis-saewska.de/ru/ (Russian)
   - ✓ https://praxis-saewska.de/uk/ (Ukrainian)

2. **View page source - check schemas:**
   - FAQ page: Look for `"@type": "FAQPage"`
   - Blog article: Look for `"@type": "BlogPosting"` and `"BreadcrumbList"`
   - Homepage: Look for `"@type": "Physician"`

**Within 1 Week:**

1. **Submit Sitemap to Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Sitemaps → Add new sitemap
   - Enter: `https://praxis-saewska.de/sitemap.xml`
   - Submit

2. **Validate Schemas:**
   - Rich Results Test: https://search.google.com/test/rich-results
   - Test these URLs:
     - `https://praxis-saewska.de/de/`
     - `https://praxis-saewska.de/de/faq/`
     - `https://praxis-saewska.de/de/blog/welcome-to-our-site/`
   - Should see: Valid schema markup detected

3. **Check Search Console:**
   - Structured Data report
   - Should show: FAQPage, BreadcrumbList, BlogPosting schemas
   - No errors or warnings

**Within 2-4 Weeks:**

1. **Monitor Rich Snippets:**
   - Search Google for: "praxis saewska berlin"
   - Look for FAQ rich snippets
   - Look for article previews with breadcrumbs

2. **Check Index Status:**
   - Google Search Console → Coverage report
   - Should show: 48 valid pages indexed

3. **AI Crawler Activity:**
   - Check Cloudflare Analytics
   - Look for requests from: GPTBot, ClaudeBot, Google-Extended

## ⚠️ Troubleshooting

### Sitemap Not Generated

```bash
# Check if generate_sitemap.py exists
ls -la generate_sitemap.py

# Test manually
uv run python generate_sitemap.py output

# Check build.sh includes sitemap step
grep "generate_sitemap" build.sh
```

### Schema Not Rendering

```bash
# Rebuild locally
./build.sh

# Check template has {% block extra_head %}
grep "extra_head" themes/med_praxis/templates/faq.html

# Verify no Jinja2 errors in build output
./build.sh 2>&1 | grep -i error
```

### robots.txt Not Accessible

```bash
# Check file exists in content/
ls -la content/robots.txt

# Check STATIC_PATHS includes robots.txt
grep "STATIC_PATHS" pelicanconf.py

# Verify copied to output
ls -la output/robots.txt
```

### GitHub Actions Failing

1. Check workflow file updated correctly
2. Verify all Python files committed (generate_sitemap.py)
3. Check build logs in Actions tab
4. Ensure build.sh has execute permissions

## 📊 Success Indicators

**Week 1:**
- ✅ Sitemap submitted and processing
- ✅ No structured data errors in Search Console
- ✅ All 48 pages indexed

**Week 2-4:**
- ✅ FAQ rich snippets appearing in search results
- ✅ Article previews with breadcrumbs
- ✅ Enhanced local business listing

**Month 2-3:**
- ✅ Improved rankings for target keywords
- ✅ Increased organic traffic
- ✅ AI chatbots citing practice information correctly

## 📞 Quick Commands Reference

```bash
# Full build
./build.sh

# Check sitemap URLs
grep "<loc>" output/sitemap.xml | wc -l

# Validate XML
xmllint --noout output/sitemap.xml

# Check schemas
grep -c "FAQPage" output/de/faq/index.html
grep -c "Physician" output/de/index.html

# Local preview
python -m http.server 8000 -d output

# Deploy
git add . && git commit -m "SEO optimization" && git push
```

---

**Status:** Ready to deploy ✅
**Estimated deployment time:** 5 minutes
**Estimated verification time:** 15 minutes
**First results visible:** 1-2 weeks

🚀 **Good luck with deployment!**
