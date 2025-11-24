# -*- coding: utf-8 -*-
"""
Pelican configuration for Praxis Saewska website
"""

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

# Site data for default language (de)
# These variables are available in templates for the default language
CONTACT_INFO = {
    'address_street': 'Uhlandstr. 87',
    'address_city': '10717 Berlin',
    'phone': '[Ihre Telefonnummer]',
    'email': 'info@praxis-saewska.de',
}
OPENING_HOURS = {
    'monday': '09:00 - 17:00',
    'tuesday': '09:00 - 17:00',
    'wednesday': '09:00 - 17:00',
    'thursday': '09:00 - 17:00',
    'friday': '09:00 - 17:00',
    'saturday': 'Geschlossen',
    'sunday': 'Geschlossen',
}
PRACTICE_INFO = {
    'name': 'Praxis Saewska',
    'doctor_name': 'Dr. PhD Elena Saewska',
    'specialty': 'Gynäkologie und Geburtshilfe',
}

I18N_SUBSITES = {
    'de': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '',
        'LOCALE': 'de_DE.UTF-8',
        'CONTACT_INFO': {
            'address_street': 'Uhlandstr. 87',
            'address_city': '10717 Berlin',
            'phone': '[Ihre Telefonnummer]',
            'email': 'info@praxis-saewska.de',
        },
        'OPENING_HOURS': {
            'monday': '09:00 - 17:00',
            'tuesday': '09:00 - 17:00',
            'wednesday': '09:00 - 17:00',
            'thursday': '09:00 - 17:00',
            'friday': '09:00 - 17:00',
            'saturday': 'Geschlossen',
            'sunday': 'Geschlossen',
        },
        'PRACTICE_INFO': {
            'name': 'Praxis Saewska',
            'doctor_name': 'Dr. PhD Elena Saewska',
            'specialty': 'Gynäkologie und Geburtshilfe',
        },
    },
    'en': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '/en',
        'LOCALE': 'en_US.UTF-8',
        'CONTACT_INFO': {
            'address_street': 'Uhlandstr. 87',
            'address_city': '10717 Berlin',
            'phone': '[Ihre Telefonnummer]',
            'email': 'info@praxis-saewska.de',
        },
        'OPENING_HOURS': {
            'monday': '09:00 - 17:00',
            'tuesday': '09:00 - 17:00',
            'wednesday': '09:00 - 17:00',
            'thursday': '09:00 - 17:00',
            'friday': '09:00 - 17:00',
            'saturday': 'Geschlossen',
            'sunday': 'Geschlossen',
        },
        'PRACTICE_INFO': {
            'name': 'Praxis Saewska',
            'doctor_name': 'Dr. PhD Elena Saewska',
            'specialty': 'Gynäkologie und Geburtshilfe',
        },
    },
    'ru': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '/ru',
        'LOCALE': 'ru_RU.UTF-8',
        'CONTACT_INFO': {
            'address_street': 'Uhlandstr. 87',
            'address_city': '10717 Berlin',
            'phone': '[Ihre Telefonnummer]',
            'email': 'info@praxis-saewska.de',
        },
        'OPENING_HOURS': {
            'monday': '09:00 - 17:00',
            'tuesday': '09:00 - 17:00',
            'wednesday': '09:00 - 17:00',
            'thursday': '09:00 - 17:00',
            'friday': '09:00 - 17:00',
            'saturday': 'Geschlossen',
            'sunday': 'Geschlossen',
        },
        'PRACTICE_INFO': {
            'name': 'Praxis Saewska',
            'doctor_name': 'Dr. PhD Elena Saewska',
            'specialty': 'Gynäkologie und Geburtshilfe',
        },
    },
    'uk': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '/uk',
        'LOCALE': 'uk_UA.UTF-8',
        'CONTACT_INFO': {
            'address_street': 'Uhlandstr. 87',
            'address_city': '10717 Berlin',
            'phone': '[Ihre Telefonnummer]',
            'email': 'info@praxis-saewska.de',
        },
        'OPENING_HOURS': {
            'monday': '09:00 - 17:00',
            'tuesday': '09:00 - 17:00',
            'wednesday': '09:00 - 17:00',
            'thursday': '09:00 - 17:00',
            'friday': '09:00 - 17:00',
            'saturday': 'Geschlossen',
            'sunday': 'Geschlossen',
        },
        'PRACTICE_INFO': {
            'name': 'Praxis Saewska',
            'doctor_name': 'Dr. PhD Elena Saewska',
            'specialty': 'Gynäkologie und Geburtshilfe',
        },
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

