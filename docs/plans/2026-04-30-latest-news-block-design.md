# Latest News Preview Block — Design

## Goal

Add a "Latest News" block to the homepage between the hero and services sections. Shows the 3 most recent articles for the current language, with Title, Category, and Summary. No "read all" link.

## Placement

`themes/med_praxis/templates/index.html` — new section inserted between `<section class="hero">` and `<section id="services">`.

## Template

```jinja
<section id="latest-news" class="section latest-news-section">
  <div class="container">
    <h2 class="section-title">{{ _('Latest News') }}</h2>
    <div class="news-grid">
      {% set ns = namespace(count=0) %}
      {% for article in articles %}
        {% if article.lang == DEFAULT_LANG and ns.count < 3 %}
          {% set ns.count = ns.count + 1 %}
          <a href="{{ article.url }}" class="news-card">
            <span class="news-category">{{ article.category }}</span>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
          </a>
        {% endif %}
      {% endfor %}
    </div>
  </div>
</section>
```

Articles are already ordered by `reversed-date` via `ARTICLE_ORDER_BY` in `pelicanconf.py`. If fewer than 3 articles exist in a language, the grid renders what's available.

## CSS

Added to `themes/med_praxis/static/css/styles.css`:

```css
.latest-news-section {
  background-color: var(--bg-light);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.news-card {
  display: block;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.news-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.news-category {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.news-card h3 {
  margin: 0.25rem 0 0.75rem;
  font-size: 1rem;
}

.news-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
```

## i18n

New `msgid "Latest News"` entry added to all 4 `.po` files and recompiled to `.mo`:

| File | msgstr |
|------|--------|
| `translations/de/LC_MESSAGES/messages.po` | `Aktuelles` |
| `translations/en/LC_MESSAGES/messages.po` | `Latest News` |
| `translations/ru/LC_MESSAGES/messages.po` | `Новости` |
| `translations/uk/LC_MESSAGES/messages.po` | `Новини` |

## Files to Change

1. `themes/med_praxis/templates/index.html` — add new section
2. `themes/med_praxis/static/css/styles.css` — add news grid styles
3. `themes/med_praxis/translations/de/LC_MESSAGES/messages.po` + recompile `.mo`
4. `themes/med_praxis/translations/en/LC_MESSAGES/messages.po` + recompile `.mo`
5. `themes/med_praxis/translations/ru/LC_MESSAGES/messages.po` + recompile `.mo`
6. `themes/med_praxis/translations/uk/LC_MESSAGES/messages.po` + recompile `.mo`
