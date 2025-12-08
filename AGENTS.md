# Repository Guidelines

## Project Structure & Module Organization
- `content/pages/{slug}.{lang}.md` holds page content; keep slugs aligned across languages (de/en/ru/uk) and include `Title`, `Lang`, `Slug`, `Template` metadata.
- `content/images/` for assets; `output/` is generated and should not be committed.
- `themes/med_praxis/templates/` contains Jinja2 templates; shared styles/scripts live in `themes/med_praxis/static/`, translations in `themes/med_praxis/translations/{lang}/`.
- `site_data.py` is the single source for opening hours, contact details, and practice info; configs import it directly.
- `pelicanconf.py` drives local builds, `publishconf.py` production; `build.sh` runs the typical multilingual build flow.

## Build, Test, and Development Commands
- `uv sync` installs dependencies (Python 3.12+).
- `./build.sh` compiles translations and generates the multilingual dev site into `output/`.
- `python3 compile_translations.py` compiles `.po` files to `.mo` whenever translation strings change.
- `uv run pelican content -s pelicanconf.py` builds for development; add `-lr` for autoreload + local server.
- `uv run pelican content -s publishconf.py` builds with production URLs; run before releasing.
- `python -m http.server 8000 -d output` previews the generated site locally.

## Coding Style & Naming Conventions
- Python: 4-space indentation, prefer small pure helpers; keep data in `site_data.py` and avoid hardcoding hours/contact info elsewhere.
- Templates: use `_('text')` for strings needing translation; keep shared pieces in `macros.html`; avoid inline styles.
- Content: name files `about.de.md`, `faq.en.md`, etc.; keep slugs consistent across languages; use Markdown headings rather than HTML unless necessary.
- Assets: place theme assets under `themes/med_praxis/static/`; use lowercase-kebab filenames.

## Testing Guidelines
- Rebuild before submitting: `uv run pelican content -s publishconf.py` (or `./build.sh` for the dev path) and scan console output for warnings.
- Confirm `output/de`, `output/en`, `output/ru`, `output/uk` exist with expected pages; spot-check language switcher and nav.
- After translation changes, ensure `.po` files are compiled and rendered; optionally validate HTML via `html5validator --root output/` if available.

## Commit & Pull Request Guidelines
- Commits: concise, imperative titles that reflect scope (e.g., "Update about page titles", "Add blog translations"); group related content/template changes.
- PRs: include a summary of pages/templates touched, language coverage, and the build command run; attach before/after screenshots for visual updates when feasible; link issues/tickets when applicable.
- Exclude generated `output/` files and virtualenv artifacts; commit compiled `*.mo` only alongside their updated `.po` sources.

## Security & Configuration Tips
- No secrets belong in this repo; configs assume public GitHub Pages/Cloudflare deployments.
- When adding assets or redirects, ensure `STATIC_PATHS` and production settings in `publishconf.py` still cover them.
