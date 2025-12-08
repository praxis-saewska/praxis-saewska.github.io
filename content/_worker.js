/**
 * Cloudflare Worker for Language-based Redirects
 * 
 * This worker intercepts requests to the root path and redirects users
 * to the appropriate language version based on their Accept-Language header.
 * 
 * Supported languages:
 * - German (de) - default/fallback
 * - English (en)
 * - Russian (ru)
 * - Ukrainian (uk)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Only handle root path redirects
    if (url.pathname === '/' || url.pathname === '/index.html') {
      const acceptLanguage = request.headers.get('Accept-Language') || '';
      const languages = acceptLanguage.toLowerCase();
      
      // Check language preference in order of priority
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
    
    // For all other paths, fetch the asset normally
    return env.ASSETS.fetch(request);
  }
};
