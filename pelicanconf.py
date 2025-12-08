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
# SITEURL = 'https://praxis-saewska.de/'

# Path settings
PATH = 'content'
OUTPUT_PATH = 'output'
STATIC_PATHS = ['images', 'site.webmanifest', 'robots.txt', 'sitemap.xml', 'CNAME', 'llms.txt', '_redirects', '_worker.js']


# Theme static directory
THEME_STATIC_DIR = 'theme'

# Time and locale  
# Используем английский как DEFAULT_LANG (технический язык для Pelican)
# Все реальные языки (включая немецкий) генерируются как подсайты с переводами
# .htaccess редиректит корень на соответствующий язык на основе Accept-Language
TIMEZONE = 'Europe/Berlin'
DEFAULT_LANG = 'en'  # Технический язык - английский (msgid = перевод)
LOCALE = 'en_US.UTF-8'
DEFAULT_DATE_FORMAT = '%d.%m.%Y'

# URL settings - clean URLs without extensions
# Для подсайтов эти настройки переопределяются в I18N_SUBSITES
ARTICLE_URL = 'blog/{slug}/'
ARTICLE_SAVE_AS = 'blog/{slug}/index.html'
PAGE_URL = '{slug}/'
CATEGORY_URL = 'blog/category/{slug}/'
CATEGORY_SAVE_AS = 'blog/category/{slug}/index.html'

# Полностью отключаем генерацию основного сайта (DEFAULT_LANG) в корне
# Генерируем ТОЛЬКО подсайты в /de/, /en/, /ru/, /uk/
INDEX_SAVE_AS = ''      # Нет главной страницы в корне
PAGE_SAVE_AS = ''       # Нет контент-страниц в корне
ARTICLE_SAVE_AS = ''    # Нет статей в корне (будет включено в подсайтах)
AUTHORS_SAVE_AS = ''    # Нет страницы авторов
AUTHOR_SAVE_AS = ''    # Нет страницы автора
CATEGORY_SAVE_AS = ''  # Нет страницы категории
CATEGORIES_SAVE_AS = '' # Нет страницы категорий (будет включено в подсайтах)
TAGS_SAVE_AS = ''       # Нет страницы тегов
TAG_SAVE_AS = ''    # Нет страницы тега 
ARCHIVES_SAVE_AS = ''   # Нет страницы архивов (будет включено в подсайтах)

# Article settings
DEFAULT_CATEGORY = 'Articles'
ARTICLE_ORDER_BY = 'reversed-date'
USE_FOLDER_AS_CATEGORY = False

# Pagination
DEFAULT_PAGINATION = 10

# Theme
THEME = 'themes/med_praxis'

# Plugins
PLUGIN_PATHS = ['.']
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

# I18N plugin settings  
I18N_GETTEXT_LOCALEDIR = 'themes/med_praxis/translations/'
I18N_GETTEXT_DOMAIN = 'messages'

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

# Site data for default language (en - технический)
# Основной сайт не используется (отключен через INDEX_SAVE_AS = '')
# Все языки генерируются как подсайты
OPENING_HOURS = get_opening_hours_for_lang('en')
CONTACT_INFO = CONTACT_INFO
PRACTICE_INFO = PRACTICE_INFO
CLOSED_TEXT = CLOSED_TEXT

# Для i18n_subsites - использовать данные из site_data с переводами
# Все языки как подсайты, немецкий тоже получает свою папку /de
I18N_SUBSITES = {
    'de': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '',  # Пустой SITEURL для правильных путей к статическим файлам
        'LOCALE': 'de_DE.UTF-8',
        'LANG_PREFIX': '/de',  # Префикс для навигационных ссылок
        # Включаем генерацию страниц для подсайта
        'INDEX_SAVE_AS': 'index.html',
        'PAGE_SAVE_AS': '{slug}/index.html',
        # Articles и blog
        'ARTICLE_URL': 'blog/{slug}/',
        'ARTICLE_SAVE_AS': 'blog/{slug}/index.html',
        'ARCHIVES_SAVE_AS': 'blog/index.html',
        'CATEGORY_URL': 'blog/category/{slug}/',
        'CATEGORY_SAVE_AS': 'blog/category/{slug}/index.html',
        'CATEGORIES_SAVE_AS': 'blog/categories/index.html',
        'OPENING_HOURS': get_opening_hours_for_lang('de'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
    'en': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '',  # Пустой SITEURL для правильных путей к статическим файлам
        'LOCALE': 'en_US.UTF-8',
        'LANG_PREFIX': '/en',  # Префикс для навигационных ссылок
        # Включаем генерацию страниц для подсайта
        'INDEX_SAVE_AS': 'index.html',
        'PAGE_SAVE_AS': '{slug}/index.html',
        # Articles и blog
        'ARTICLE_URL': 'blog/{slug}/',
        'ARTICLE_SAVE_AS': 'blog/{slug}/index.html',
        'ARCHIVES_SAVE_AS': 'blog/index.html',
        'CATEGORY_URL': 'blog/category/{slug}/',
        'CATEGORY_SAVE_AS': 'blog/category/{slug}/index.html',
        'CATEGORIES_SAVE_AS': 'blog/categories/index.html',
        'OPENING_HOURS': get_opening_hours_for_lang('en'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
    'ru': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '',  # Пустой SITEURL для правильных путей к статическим файлам
        'LOCALE': 'ru_RU.UTF-8',
        'LANG_PREFIX': '/ru',  # Префикс для навигационных ссылок
        # Включаем генерацию страниц для подсайта
        'INDEX_SAVE_AS': 'index.html',
        'PAGE_SAVE_AS': '{slug}/index.html',
        # Articles и blog
        'ARTICLE_URL': 'blog/{slug}/',
        'ARTICLE_SAVE_AS': 'blog/{slug}/index.html',
        'ARCHIVES_SAVE_AS': 'blog/index.html',
        'CATEGORY_URL': 'blog/category/{slug}/',
        'CATEGORY_SAVE_AS': 'blog/category/{slug}/index.html',
        'CATEGORIES_SAVE_AS': 'blog/categories/index.html',
        'OPENING_HOURS': get_opening_hours_for_lang('ru'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
    'uk': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '',  # Пустой SITEURL для правильных путей к статическим файлам
        'LOCALE': 'uk_UA.UTF-8',
        'LANG_PREFIX': '/uk',  # Префикс для навигационных ссылок
        # Включаем генерацию страниц для подсайта
        'INDEX_SAVE_AS': 'index.html',
        'PAGE_SAVE_AS': '{slug}/index.html',
        # Articles и blog
        'ARTICLE_URL': 'blog/{slug}/',
        'ARTICLE_SAVE_AS': 'blog/{slug}/index.html',
        'ARCHIVES_SAVE_AS': 'blog/index.html',
        'CATEGORY_URL': 'blog/category/{slug}/',
        'CATEGORY_SAVE_AS': 'blog/category/{slug}/index.html',
        'CATEGORIES_SAVE_AS': 'blog/categories/index.html',
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
