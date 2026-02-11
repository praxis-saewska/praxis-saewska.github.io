"""
Pelican plugin to provide an absolute_url Jinja2 filter.

This filter converts relative paths to absolute URLs using MAIN_SITEURL,
fixing SEO issues with canonical and hreflang tags while keeping
static file paths working correctly with empty SITEURL in subsites.
"""

from pelican import signals


def absolute_url(relative_path, config):
    """
    Convert relative path to absolute URL using main SITEURL.

    Args:
        relative_path: Relative path or URL component (e.g., '/de/blog/article/')
        config: Pelican settings dictionary

    Returns:
        Absolute URL with protocol and domain (e.g., 'https://praxis-saewska.de/de/blog/article/')
    """
    # Get the main site URL (the full domain with protocol)
    main_siteurl = config.get("MAIN_SITEURL", config.get("SITEURL", ""))
    main_siteurl = main_siteurl.rstrip("/")

    # Handle empty or None paths
    if not relative_path:
        return main_siteurl + "/"

    # Convert to string and clean up the path
    relative_path = str(relative_path).lstrip("/")

    # Clean up any ./ sequences that might appear in URLs
    relative_path = relative_path.replace("/./", "/")

    # Handle case where path might already be absolute
    if relative_path.startswith("http://") or relative_path.startswith("https://"):
        return relative_path

    # Construct absolute URL
    if relative_path:
        return f"{main_siteurl}/{relative_path}"
    else:
        return main_siteurl + "/"


def add_filter(pelican):
    """Add the absolute_url filter to Jinja2 environment."""
    pelican.env.filters["absolute_url"] = lambda path: absolute_url(
        path, pelican.settings
    )


def register():
    """Register the plugin with Pelican."""
    signals.generator_init.connect(add_filter)
