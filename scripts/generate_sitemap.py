#!/usr/bin/env python3
"""
Generate sitemap.xml for Praxis Saewska multilingual website
This is a simple sitemap generator compatible with Pelican without requiring plugins
"""

from pathlib import Path


def generate_sitemap(output_dir="output", base_url="https://praxis-saewska.de"):
    """Generate sitemap.xml from the output directory"""

    sitemap_header = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"""

    sitemap_footer = "</urlset>\n"

    urls = []
    output_path = Path(output_dir)

    if not output_path.exists():
        print(f"Error: Output directory {output_dir} does not exist")
        return False

    # Define priorities and change frequencies for different content types
    priorities = {
        "index": "1.0",
        "page": "0.8",
        "article": "0.7",
        "blog_index": "0.6",
        "category": "0.5",
    }

    changefreqs = {
        "index": "weekly",
        "page": "monthly",
        "article": "monthly",
        "blog_index": "weekly",
        "category": "monthly",
    }

    # Languages
    languages = ["de", "en", "ru", "uk"]

    # Add language index pages
    for lang in languages:
        lang_dir = output_path / lang
        if lang_dir.exists() and lang_dir.is_dir():
            index_file = lang_dir / "index.html"
            if index_file.exists():
                url = f"{base_url}/{lang}/"
                urls.append(
                    {
                        "loc": url,
                        "priority": priorities["index"],
                        "changefreq": changefreqs["index"],
                    }
                )

    # Walk through output directory and find all HTML files
    for lang in languages:
        lang_dir = output_path / lang
        if not lang_dir.exists():
            continue

        for html_file in lang_dir.rglob("*.html"):
            # Skip index.html (already added above)
            if html_file.name == "index.html" and html_file.parent == lang_dir:
                continue

            # Get relative path from language directory
            rel_path = html_file.relative_to(lang_dir)

            # Convert file path to URL
            url_path = str(rel_path.parent) if rel_path.parent != Path(".") else ""

            # Skip certain paths
            if any(
                skip in str(rel_path)
                for skip in ["tag/", "tags/", "author/", "authors/"]
            ):
                continue

            # Determine content type
            if "blog" in str(rel_path):
                if html_file.parent.name == "blog" and html_file.name == "index.html":
                    content_type = "blog_index"
                elif "category" in str(rel_path):
                    content_type = "category"
                else:
                    content_type = "article"
            else:
                content_type = "page"

            # Build URL
            if url_path:
                url = f"{base_url}/{lang}/{url_path}/"
            else:
                url = f"{base_url}/{lang}/"

            # Normalize URL (remove double slashes, ensure trailing slash for directories)
            url = url.replace("//", "/").replace(":/", "://")
            if not url.endswith(".html") and not url.endswith("/"):
                url += "/"

            urls.append(
                {
                    "loc": url,
                    "priority": priorities.get(content_type, "0.5"),
                    "changefreq": changefreqs.get(content_type, "monthly"),
                }
            )

    # Remove duplicates
    seen_urls = set()
    unique_urls = []
    for url_data in urls:
        if url_data["loc"] not in seen_urls:
            seen_urls.add(url_data["loc"])
            unique_urls.append(url_data)

    # Sort URLs by priority (descending) then by URL (ascending)
    unique_urls.sort(key=lambda x: (-float(x["priority"]), x["loc"]))

    # Generate sitemap XML
    sitemap_content = sitemap_header

    for url_data in unique_urls:
        sitemap_content += f"""  <url>
    <loc>{url_data["loc"]}</loc>
    <changefreq>{url_data["changefreq"]}</changefreq>
    <priority>{url_data["priority"]}</priority>
  </url>
"""

    sitemap_content += sitemap_footer

    # Write sitemap
    sitemap_file = output_path / "sitemap.xml"
    sitemap_file.write_text(sitemap_content, encoding="utf-8")

    print(f"✓ Generated sitemap.xml with {len(unique_urls)} URLs")
    print(f"  Location: {sitemap_file}")

    return True


if __name__ == "__main__":
    import sys

    # Allow output directory to be specified as argument
    output_dir = sys.argv[1] if len(sys.argv) > 1 else "output"

    success = generate_sitemap(output_dir)
    sys.exit(0 if success else 1)
