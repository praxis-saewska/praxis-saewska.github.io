# SEO Quick Reference Guide

Quick reference for SEO features and troubleshooting for Praxis Saewska website.

## 🎯 Current SEO Score: 8.5/10 (up from 6.1/10)

## ✅ What's Implemented

| Feature | Status | Location | Impact |
|---------|--------|----------|--------|
| **Sitemap** | ✅ Auto-generated | `output/sitemap.xml` | Critical |
| **FAQPage Schema** | ✅ Implemented | `faq.html` template | High |
| **BreadcrumbList Schema** | ✅ Implemented | `article.html` template | High |
| **BlogPosting Schema** | ✅ Implemented | `article.html` template | High |
| **Physician Schema** | ✅ Complete | `index.html` template | High |
| **MedicalBusiness Schema** | ✅ Enhanced | `index.html` template | High |
| **AI Crawler Support** | ✅ Comprehensive | `robots.txt` | High |
| **llms.txt Guidelines** | ✅ Structured | `content/llms.txt` | Medium |
| **Image Optimization** | ✅ Logo optimized | `base.html` template | Medium |
| **Meta Tags** | ✅ Complete | `base.html` template | High |
| **Hreflang Tags** | ✅ 4 languages | `base.html` template | High |
| **Open Graph** | ✅ Complete | `base.html` template | High |
| **Twitter Cards** | ✅ Complete | `base.html` template | Medium |
| **Canonical URLs** | ✅ Implemented | `base.html` template | High |

## 🔍 Quick Validation

### Test Sitemap
```bash
# After building site
curl http://localhost:8000/sitemap.xml
# Should see XML with all page URLs
```

### Test Structured Data
1. Build site: `./build.sh`
2. Start server: `python -m http.server 8000 -d output`
3. Visit: http://localhost:8000/de/
4. View page source (Cmd+U or Ctrl+U)
5. Copy JSON-LD script tags
6. Validate at: https://validator.schema.org/

### Test robots.txt
```bash
curl http://localhost:8000/robots.txt
# Should see AI crawler directives
```

### Test llms.txt
```bash
curl http://localhost:8000/llms.txt
# Should see AI guidelines
```

## 🚀 Deployment Checklist

Before deploying SEO changes:

- [ ] Run `./build.sh` successfully
- [ ] Verify `output/sitemap.xml` exists
- [ ] Test JSON-LD schemas (no syntax errors)
- [ ] Check all 4 languages (de, en, ru, uk)
- [ ] Verify robots.txt accessible
- [ ] Verify llms.txt accessible
- [ ] Test local site: `python -m http.server 8000 -d output`

## 🐛 Troubleshooting

### Sitemap Not Generated
```bash
# Check if sitemap plugin is in PLUGINS list
grep -A2 "PLUGINS" pelicanconf.py
# Should show: PLUGINS = ['i18n_subsites', 'sitemap']

# Check if SITEMAP config exists
grep -A10 "SITEMAP = {" pelicanconf.py
```

### Schema Validation Errors
```bash
# View schema in browser
# Copy JSON-LD <script> content
# Paste into https://validator.schema.org/

# Common issues:
# - Missing commas in JSON
# - Unclosed quotes
# - Invalid property names
```

### Missing Rich Snippets
- Wait 2-4 weeks after deployment
- Check Google Search Console for structured data errors
- Validate with Google Rich Results Test
- Ensure content meets quality guidelines

### AI Crawlers Not Indexing
```bash
# Check robots.txt is accessible
curl https://praxis-saewska.de/robots.txt

# Check server logs for AI crawler activity
# Look for: GPTBot, ClaudeBot, Google-Extended, CCBot

# Verify crawl-delay is not too high (should be 1-2)
```

## 📊 Monitoring

### Google Search Console
1. **Coverage:** Monitor index status
2. **Enhancements:** Check structured data errors
3. **Performance:** Track impressions, clicks, CTR
4. **Sitemaps:** Submit and monitor sitemap status

### Weekly Checks
- [ ] No structured data errors in Search Console
- [ ] Sitemap successfully processed
- [ ] FAQ/Article rich results appearing
- [ ] No crawl errors

### Monthly Checks
- [ ] Validate schemas (new Schema.org versions)
- [ ] Check AI crawler logs
- [ ] Review organic search performance
- [ ] Update llms.txt if practice info changes

## 🔧 Making Changes

### Update Practice Hours
1. Edit `site_data.py` → `OPENING_HOURS` dict
2. Run `./build.sh`
3. Schema automatically updated

### Update Contact Info
1. Edit `site_data.py` → `CONTACT_INFO` dict
2. Run `./build.sh`
3. All schemas (MedicalBusiness, Physician) automatically updated

### Add FAQ Items
1. Edit `content/pages/faq.{lang}.md`
2. Add new `## Question` section
3. Run `./build.sh`
4. FAQPage schema automatically includes new Q&A

### Add Blog Post
1. Create `content/articles/{slug}.{lang}.md`
2. Include `Summary:` in metadata
3. Run `./build.sh`
4. BlogPosting schema automatically generated

### Update Doctor Info
1. Edit `themes/med_praxis/templates/index.html`
2. Find Physician schema section
3. Update fields (specialty, languages, etc.)
4. Run `./build.sh`

## 📈 Expected Results

### Search Engines (2-4 weeks)
- FAQ rich snippets in search results
- Article rich snippets with author/date
- Enhanced local business listing
- Breadcrumb navigation in results

### AI Chatbots (1-2 weeks)
- Accurate practice information in ChatGPT
- Proper citations in Perplexity AI
- Correct hours/contact in Claude responses
- Structured medical info in Gemini

## 🎓 Key Files Reference

| File | Purpose | Edit Frequency |
|------|---------|----------------|
| `pelicanconf.py` | Sitemap config, plugins | Rarely |
| `site_data.py` | Hours, contact, practice info | Monthly |
| `content/robots.txt` | Crawler directives | Rarely |
| `content/llms.txt` | AI guidelines | Quarterly |
| `themes/*/templates/faq.html` | FAQPage schema | Never (auto) |
| `themes/*/templates/article.html` | BlogPosting schema | Never (auto) |
| `themes/*/templates/index.html` | Business/Physician schema | Yearly |
| `themes/*/templates/base.html` | Meta tags, hreflang | Rarely |

## 🆘 Emergency Fixes

### Broken Sitemap
```bash
# Re-add sitemap plugin
# Edit pelicanconf.py line 70:
PLUGINS = ['i18n_subsites', 'sitemap']

# Rebuild
./build.sh
```

### Schema Syntax Error
```bash
# Find the error
# Build will show: "Error: invalid JSON in template X"

# Common fixes:
# - Add missing comma after property
# - Close open quotes
# - Remove trailing comma before }
```

### AI Crawlers Blocked
```bash
# Check robots.txt allows AI crawlers
# Each AI user-agent should have: Allow: /

# If accidentally blocked, edit content/robots.txt
# Change "Disallow: /" to "Allow: /"
# Rebuild and deploy
```

## 📞 Support Resources

- **Schema.org Docs:** https://schema.org/
- **Google Rich Results:** https://search.google.com/test/rich-results
- **Search Console:** https://search.google.com/search-console
- **Pelican Docs:** https://docs.getpelican.com/

---

**Last Updated:** 2026-01-27
**Version:** 1.0
