# Latest News Preview Block — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a 3-article preview block to the homepage between the hero and services sections, showing Title, Category, and Summary for the current language.

**Architecture:** New `<section id="latest-news">` inserted in the Jinja2 index template, styled with new CSS classes in styles.css, with a translated section title in all 4 language `.po` files recompiled to `.mo` via the existing `compile_translations.py` script.

**Tech Stack:** Pelican static site generator, Jinja2 templates, CSS custom properties, Python polib for `.mo` compilation.

---

### Task 1: Add the news section to the index template

**Files:**
- Modify: `themes/med_praxis/templates/index.html:22`

**Step 1: Insert the new section after the closing `</section>` of the hero block (after line 22) and before `<section id="services">`**

Replace in `index.html`:
```jinja
    </section>

    <section id="services" class="section">
```

With:
```jinja
    </section>

    {% set ns = namespace(count=0) %}
    {% set lang_articles = [] %}
    {% for article in articles %}
      {% if article.lang == DEFAULT_LANG and ns.count < 3 %}
        {% set ns.count = ns.count + 1 %}
        {% set _ = lang_articles.append(article) %}
      {% endif %}
    {% endfor %}
    {% if lang_articles %}
    <section id="latest-news" class="section latest-news-section">
        <div class="container">
            <h2 class="section-title">{{ _('Latest News') }}</h2>
            <div class="news-grid">
                {% for article in lang_articles %}
                <a href="{{ article.url }}" class="news-card">
                    <span class="news-category">{{ article.category }}</span>
                    <h3>{{ article.title }}</h3>
                    <p>{{ article.summary }}</p>
                </a>
                {% endfor %}
            </div>
        </div>
    </section>
    {% endif %}

    <section id="services" class="section">
```

**Step 2: Commit**

```bash
git add themes/med_praxis/templates/index.html
git commit -m "feat: add latest news preview section to homepage"
```

---

### Task 2: Add CSS for the news grid

**Files:**
- Modify: `themes/med_praxis/static/css/styles.css:448` (after `.service-card p {}`, before `/* Appointment Booking Section */`)

**Step 1: Insert after line 447 (the `.service-card p` block)**

Insert this block between `.service-card p { ... }` and `/* Appointment Booking Section */`:

```css
/* Latest News Section */
.latest-news-section {
    background-color: var(--light-blue);
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
    border: 1px solid var(--border-light);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.news-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 201, 167, 0.15);
}

.news-card .news-category {
    display: inline-block;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--primary-teal);
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.news-card h3 {
    margin: 0.25rem 0 0.75rem;
    font-size: 1rem;
    color: var(--text-dark);
}

.news-card p {
    font-size: 0.9rem;
    color: var(--soft-gray);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
}
```

**Step 2: Add mobile responsive rule**

Find the `@media (max-width: 768px)` block (around line 1257) and add inside it:

```css
    .news-grid {
        grid-template-columns: 1fr;
    }
```

**Step 3: Commit**

```bash
git add themes/med_praxis/static/css/styles.css
git commit -m "style: add news grid styles for homepage latest news block"
```

---

### Task 3: Add translations for "Latest News"

**Files:**
- Modify: `themes/med_praxis/translations/de/LC_MESSAGES/messages.po`
- Modify: `themes/med_praxis/translations/en/LC_MESSAGES/messages.po`
- Modify: `themes/med_praxis/translations/ru/LC_MESSAGES/messages.po`
- Modify: `themes/med_praxis/translations/uk/LC_MESSAGES/messages.po`

**Step 1: Add to `messages.po` in each language** (append to end of file)

`de/LC_MESSAGES/messages.po`:
```po
msgid "Latest News"
msgstr "Aktuelles"
```

`en/LC_MESSAGES/messages.po`:
```po
msgid "Latest News"
msgstr "Latest News"
```

`ru/LC_MESSAGES/messages.po`:
```po
msgid "Latest News"
msgstr "Новости"
```

`uk/LC_MESSAGES/messages.po`:
```po
msgid "Latest News"
msgstr "Новини"
```

**Step 2: Recompile `.mo` files**

```bash
python3 scripts/compile_translations.py
```

Expected output:
```
✓ Compiled de/LC_MESSAGES/messages.po -> messages.mo
✓ Compiled en/LC_MESSAGES/messages.po -> messages.mo
✓ Compiled ru/LC_MESSAGES/messages.po -> messages.mo
✓ Compiled uk/LC_MESSAGES/messages.po -> messages.mo

✅ Compiled 4/4 translation files
```

**Step 3: Commit**

```bash
git add themes/med_praxis/translations/
git commit -m "i18n: add Latest News translation in all 4 languages"
```

---

### Task 4: Verify the build

**Step 1: Run Pelican build**

```bash
pelican content -s pelicanconf.py
```

Expected: no errors, output generated in `output/`.

**Step 2: Spot-check rendered output for each language**

```bash
grep -A 20 'id="latest-news"' output/de/index.html | head -25
grep -A 20 'id="latest-news"' output/en/index.html | head -25
grep -A 20 'id="latest-news"' output/ru/index.html | head -25
grep -A 20 'id="latest-news"' output/uk/index.html | head -25
```

Expected: section present with correct translated heading and article cards for each language.

**Step 3: Verify section title is translated correctly**

```bash
grep "Aktuelles\|Latest News\|Новости\|Новини" output/de/index.html output/en/index.html output/ru/index.html output/uk/index.html
```

Expected: one match per language file.

**Step 4: Commit if not already committed, then push**

```bash
git status
```
