# Cloudflare Worker SEO Configuration

## Current Setup: ✅ Good

Your `_worker.js` is well-configured for language-based redirects. It works perfectly with the sitemap and SEO implementation.

## How It Works

1. **User visits:** `https://praxis-saewska.de/`
2. **Worker checks:** `Accept-Language` header from browser
3. **Redirects to:** 
   - Ukrainian browser → `/uk/`
   - Russian browser → `/ru/`
   - English browser → `/en/`
   - German browser (or default) → `/de/`

## SEO Compatibility ✅

### ✅ Works with Sitemap
- Sitemap contains all language URLs: `/de/`, `/en/`, `/ru/`, `/uk/`
- Search engines can discover all language versions
- No conflicts with worker logic

### ✅ Works with Hreflang Tags
- Your templates already have hreflang tags
- Search engines understand language alternatives
- Worker serves the right version to users

### ✅ Works with robots.txt
- Located at `/robots.txt` (root level)
- Worker doesn't interfere (only handles `/` path)
- All crawlers can access it

## Current Configuration

**Redirect Type:** 302 (Temporary)
```javascript
return Response.redirect(new URL('/de/', url.origin), 302);
```

**Pros of 302:**
- ✅ Correct for user preference detection
- ✅ Search engines know redirect depends on user context
- ✅ Prevents consolidating link equity to single language

**Why 302 is Better Than 301 Here:**
- 301 (permanent) tells search engines "always redirect"
- 302 (temporary) tells search engines "redirect varies by user"
- For language detection, 302 is the **correct choice**

## Optional Enhancement: SEO Headers

You could add SEO-friendly headers for all responses:

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Handle root path redirects
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const acceptLanguage = request.headers.get('Accept-Language') || '';
      const languages = acceptLanguage.toLowerCase();
      
      // Ukrainian speakers
      if (languages.includes('uk')) {
        return Response.redirect(new URL('/uk/', url.origin), 302);
      }
      // Russian speakers
      if (languages.includes('ru')) {
        return Response.redirect(new URL('/ru/', url.origin), 302);
      }
      // English speakers
      if (languages.includes('en')) {
        return Response.redirect(new URL('/en/', url.origin), 302);
      }
      // German speakers or default fallback
      return Response.redirect(new URL('/de/', url.origin), 302);
    }
    
    // Fetch the asset
    const response = await env.ASSETS.fetch(request);
    
    // Add SEO-friendly headers
    const headers = new Headers(response.headers);
    
    // Vary header tells caches that response varies by language
    if (!headers.has('Vary')) {
      headers.set('Vary', 'Accept-Language');
    } else {
      const vary = headers.get('Vary');
      if (!vary.includes('Accept-Language')) {
        headers.set('Vary', `${vary}, Accept-Language`);
      }
    }
    
    // Return response with updated headers
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  }
};
```

**Benefits:**
- `Vary: Accept-Language` tells caches that content varies by language
- Improves caching behavior for CDN and browsers
- Better SEO signal to search engines

## Testing Checklist

### ✅ Verified Working

1. **Root redirect works:**
   - `curl -I https://praxis-saewska.de/` → 302 redirect
   - Redirects to appropriate language

2. **Sitemap accessible:**
   - `https://praxis-saewska.de/sitemap.xml` → works (no redirect)

3. **robots.txt accessible:**
   - `https://praxis-saewska.de/robots.txt` → works (no redirect)

4. **Language pages work:**
   - `https://praxis-saewska.de/de/` → German site
   - `https://praxis-saewska.de/en/` → English site
   - `https://praxis-saewska.de/ru/` → Russian site
   - `https://praxis-saewska.de/uk/` → Ukrainian site

## Search Engine Behavior

### Google
- Crawls all language versions via sitemap
- Sees hreflang tags linking language alternatives
- Understands 302 redirect is user-preference based
- Shows correct language in search results per user

### AI Crawlers (GPTBot, ClaudeBot, etc.)
- Crawl via sitemap (no redirect)
- Access robots.txt for instructions
- Can access all language versions directly
- No issues with worker logic

## No Changes Needed ✅

Your current `_worker.js` configuration is **optimal for SEO**. It:
- Uses correct 302 redirect type
- Only handles root path
- Doesn't interfere with sitemaps, robots.txt, or assets
- Works perfectly with multilingual setup

**Recommendation:** Keep as-is. The optional `Vary` header enhancement is nice-to-have but not required.

---

**Verified:** 2026-01-27
**Status:** ✅ Production Ready
**SEO Impact:** Positive (improves UX without hurting SEO)
