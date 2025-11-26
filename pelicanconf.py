# -*- coding: utf-8 -*-
"""
Pelican configuration for Praxis Saewska website
"""

import sys
from pathlib import Path

# Add current directory to Python path to ensure site_data can be imported
current_dir = Path(__file__).parent.absolute()
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

AUTHOR = 'Praxis Saewska'
SITENAME = 'Praxis Saewska'
SITEURL = ''

# Path settings
PATH = 'content'
OUTPUT_PATH = 'output'
STATIC_PATHS = ['images', 'site.webmanifest', 'robots.txt', 'sitemap.xml', 'CNAME']

# Theme static directory
THEME_STATIC_DIR = 'theme'

# Time and locale
TIMEZONE = 'Europe/Berlin'
DEFAULT_LANG = 'de'
DEFAULT_DATE_FORMAT = '%d.%m.%Y'

# URL settings - clean URLs without extensions
ARTICLE_URL = '{slug}/'
ARTICLE_SAVE_AS = '{slug}/index.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
INDEX_SAVE_AS = 'index.html'

# Pagination
DEFAULT_PAGINATION = False

# Theme
THEME = 'themes/custom'

# Plugins
PLUGIN_PATHS = []
PLUGINS = ['i18n_subsites']

# Feed settings (disabled)
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Markdown extensions
MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
        'markdown.extensions.toc': {},
    },
    'output_format': 'html5',
}

JINJA_ENVIRONMENT = {
    'extensions': ['jinja2.ext.i18n'],
}

# i18n_subsites configuration
# How to handle untranslated content
I18N_UNTRANSLATED_ARTICLES = 'keep'  # 'hide' (draft), 'remove', or 'keep'
I18N_UNTRANSLATED_PAGES = 'keep'  # 'hide' (hidden), 'remove', or 'keep'

# Custom settings
SITE_DESCRIPTION = 'Gynäkologische Praxis - Professionelle Betreuung für alle Fragen der Frauengesundheit'
SITE_KEYWORDS = 'Gynäkologe Berlin, Frauenarzt Berlin, Gynäkologie Charlottenburg, Schwangerschaftsbetreuung, Urogynäkologie'

# Import site data - ЕДИНСТВЕННЫЙ файл для редактирования данных
from site_data import OPENING_HOURS, CONTACT_INFO, PRACTICE_INFO, CLOSED_TEXT

# Helper function to translate opening hours based on language
def get_opening_hours_for_lang(lang='de'):
    """Get opening hours with translated 'closed' text for the given language"""
    hours = OPENING_HOURS.copy()
    closed_text = CLOSED_TEXT.get(lang, CLOSED_TEXT['de'])
    # Replace 'Geschlossen' with translated text
    for day in hours:
        if hours[day] == 'Geschlossen':
            hours[day] = closed_text
    return hours

# Site data for default language (de)
# These variables are available in templates for the default language
OPENING_HOURS = get_opening_hours_for_lang('de')
CONTACT_INFO = CONTACT_INFO
PRACTICE_INFO = PRACTICE_INFO
# CLOSED_TEXT доступен в шаблонах для перевода "Geschlossen"
CLOSED_TEXT = CLOSED_TEXT

# Для i18n_subsites - использовать данные из site_data с переводами
I18N_SUBSITES = {
    'en': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '/en',
        'LOCALE': 'en_US.UTF-8',
        'OPENING_HOURS': get_opening_hours_for_lang('en'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
    'ru': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '/ru',
        'LOCALE': 'ru_RU.UTF-8',
        'OPENING_HOURS': get_opening_hours_for_lang('ru'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
    'uk': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '/uk',
        'LOCALE': 'uk_UA.UTF-8',
        'OPENING_HOURS': get_opening_hours_for_lang('uk'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
}

# Language settings
LANGUAGES = {
    'de': 'Deutsch',
    'en': 'English',
    'ru': 'Русский',
    'uk': 'Українська',
}

# Delete output directory before generating
DELETE_OUTPUT_DIRECTORY = True

# Copy static files - handled by STATIC_PATHS

