# CSS Reorganization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize `styles.css` into 7 clearly labeled sections and remove dead code so any design change can be found immediately.

**Architecture:** Single CSS file is kept (no build step added). Dead color scheme blocks are deleted. Existing rules are reordered into 7 logical sections with consistent banner headers. No rules are rewritten.

**Tech Stack:** Plain CSS, Pelican static site generator, Cloudflare Pages.

---

## Context

**File:** `themes/med_praxis/static/css/styles.css` (1949 lines)

**Current problems:**
- Lines 1–135: 8 color scheme `:root` blocks; only scheme 1 (lines 11–22) is active — schemes 2–8 are commented-out dead code
- Typography section at lines 160–199 contains global `h1–h6 / p / a` rules, but the section comments "Paragraphs", "Headings", "Lists" etc. at lines 713–856 look like more typography — they are actually all scoped to `.faq-answer-content` and belong inside the FAQ component section
- Two separate `@media` blocks at lines 1292–1429 (general) and 1864–1930 (blog) — minor but confusing
- Section headers use inconsistent styling (some have banner boxes, most are plain one-liners)

**Desired section order:**

```
1. VARIABLES   — :root (lines 11–22, keep as-is)
2. RESET & BASE — reset, html/body, Cyrillic font (lines 136–159)
3. LAYOUT      — header, nav, language switcher, mobile menu, container, footer
4. TYPOGRAPHY  — global h1–h6, p, a (lines 160–199, keep in place)
5. COMPONENTS  — hero, buttons, services, appointment, contact, maps,
                 FAQ (incl. faq-answer-content styles), about, loading,
                 scroll-to-top, cookie consent, contact form
6. PAGES       — blog layout, breadcrumb, category filter, article cards,
                 article page, article translations, article content, article footer
7. RESPONSIVE  — all @media queries (general + blog + print)
```

**How to verify after each task:** Run `cd /path/to/repo && pelican content -s pelicanconf.py -o /tmp/test-output` and open `/tmp/test-output/index.html` in a browser. All pages should look identical to before.

---

## Task 1: Remove dead color scheme blocks

**Files:**
- Modify: `themes/med_praxis/static/css/styles.css:1–135`

**Step 1: Confirm which lines to delete**

Open `styles.css`. Verify:
- Line 11–22: active `:root` block (KEEP — this is the live scheme)
- Lines 24–135: schemes 2–8 (all wrapped in `/* ... */` block comments — DELETE)

**Step 2: Delete lines 24–135**

Delete everything from `/* СХЕМА 2: КЛАССИЧЕСКАЯ СИНЯЯ */` through the closing `*/` of scheme 8 (ends at line 135, just before `/* Reset and Base Styles */`).

After deletion the file should jump from the closing `}` of the `:root` block (after `--accent-coral: #F87171;`) directly to `/* Reset and Base Styles */`.

**Step 3: Verify**

Build the site and confirm the homepage looks identical. The active teal color scheme must still apply.

**Step 4: Commit**

```bash
git add themes/med_praxis/static/css/styles.css
git commit -m "style: remove unused color scheme blocks from styles.css"
```

---

## Task 2: Fix misleading FAQ sub-section comment headers

**Files:**
- Modify: `themes/med_praxis/static/css/styles.css` (after Task 1, approximately lines 600–750)

**Context:** After Task 1, the file shrinks by ~113 lines. The section headers "Paragraphs", "Headings", "Lists", "Text formatting", "Code and pre", "Blockquote", "Horizontal rule" appear to be global typography but every rule under them is scoped to `.faq-answer-content`. This misleads anyone looking for typography rules.

**Step 1: Find the block**

Search for `/* Paragraphs */` in the file. Confirm the line immediately below it is:

```css
.faq-answer-content p {
```

If yes, these are FAQ-scoped rules, not global typography.

**Step 2: Replace the block of misleading headers**

Replace the comment block spanning from `/* Paragraphs */` through `/* Horizontal rule */` with a single header:

```css
/* FAQ answer content — rich text styles (paragraphs, headings, lists, code, blockquote) */
```

This is one comment replacing ~7 individual ones. The CSS rules themselves are unchanged.

**Step 3: Verify**

Build the site. Open the FAQ page and expand several answers. All formatted content (bold, lists, links) must render identically to before.

**Step 4: Commit**

```bash
git add themes/med_praxis/static/css/styles.css
git commit -m "style: clarify FAQ answer content section header"
```

---

## Task 3: Add 7-section banner headers

**Files:**
- Modify: `themes/med_praxis/static/css/styles.css`

**Context:** The file now has inconsistent section markers. This task replaces them with uniform banner-style headers matching the 7-section structure.

**Step 1: Replace the opening color-scheme comment block**

The file currently starts with:

```css
/* ============================================
   ЦВЕТОВЫЕ СХЕМЫ ДЛЯ МЕДИЦИНСКОЙ ПРАКТИКИ
   ...
   ============================================ */
/* СХЕМА 1: БИРЮЗОВАЯ (ТЕКУЩАЯ) - Свежесть, чистота, современность */
:root {
```

Replace the opening comment (lines 1–10 before Task 1; adjust line numbers after Tasks 1 & 2) with:

```css
/* ============================================================
   1. VARIABLES
   — CSS custom properties: colors, spacing, fonts
   ============================================================ */
:root {
```

**Step 2: Replace `/* Reset and Base Styles */` and `/* Ensure proper Cyrillic font rendering */`**

These two adjacent comments both belong to the Reset & Base section. Replace the first one with a banner and drop the second (its content is self-evident from the selectors):

```css
/* ============================================================
   2. RESET & BASE
   — Box model reset, html/body defaults, Cyrillic font support
   ============================================================ */
```

Delete the standalone `/* Ensure proper Cyrillic font rendering */` comment line (keep the CSS rule that follows it).

**Step 3: Replace `/* Typography */`**

```css
/* ============================================================
   4. TYPOGRAPHY
   — Global headings (h1–h6), paragraphs, links
   ============================================================ */
```

(Note: numbered 4 because Layout section will come between Reset and Typography.)

**Step 4: Add a Layout section banner before `/* Header and Navigation */`**

Insert before `/* Header and Navigation */`:

```css
/* ============================================================
   3. LAYOUT
   — Header, navigation, language switcher, mobile menu,
     container, footer
   ============================================================ */
```

Keep the existing sub-comments (`/* Header and Navigation */`, `/* Navigation */`, etc.) as plain one-liners beneath it — they're fine as sub-labels.

**Step 5: Add a Components section banner**

Find the `/* Hero Section */` comment. Insert before it:

```css
/* ============================================================
   5. COMPONENTS
   — Hero, buttons, services grid, appointment, contact,
     maps, FAQ, about, footer utilities, cookie consent,
     contact form, loading, scroll-to-top
   ============================================================ */
```

**Step 6: Add a Pages section banner**

Find `/* ============================================` / `BLOG & ARTICLES STYLES` banner. Replace it with:

```css
/* ============================================================
   6. PAGES
   — Blog listing, article pages, breadcrumb, category filter
   ============================================================ */
```

**Step 7: Add a Responsive section banner**

Find `/* Responsive Design */`. Replace it with:

```css
/* ============================================================
   7. RESPONSIVE
   — Media queries: 768px, 480px breakpoints + print
   ============================================================ */
```

The second `@media` block for blog (after the Pages section) should get a sub-label:

```css
/* Responsive — blog & article overrides */
```

**Step 8: Verify**

Build the site. Check homepage, contact, FAQ, about, and a blog article page. Everything must look identical. Check that browser devtools shows styles resolving correctly (no missing rules).

**Step 9: Commit**

```bash
git add themes/med_praxis/static/css/styles.css
git commit -m "style: add 7-section banner headers to styles.css for maintainability"
```

---

## Done

After all three tasks the file will have:
- ~113 fewer lines (dead code removed)
- Clear numbered section banners at a glance
- No misleading comment headers
- Zero behavior change — pure reorganization
