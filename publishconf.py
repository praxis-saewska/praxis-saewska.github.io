# -*- coding: utf-8 -*-
"""
Production configuration for Praxis Saewska website
"""

import sys
from pathlib import Path

# Add current directory to Python path to ensure pelicanconf can be imported
current_dir = Path(__file__).parent.absolute()
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from pelicanconf import *

# Production URL
SITEURL = 'https://praxis-saewska.de'
RELATIVE_URLS = False

# Update i18n_subsites with production URLs
# Используем данные из site_data (уже импортированы через pelicanconf)
# Функция get_opening_hours_for_lang уже доступна из pelicanconf
from site_data import CONTACT_INFO, PRACTICE_INFO, CLOSED_TEXT

I18N_SUBSITES = {
    'en': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': 'https://praxis-saewska.de/en',
        'LOCALE': 'en_US.UTF-8',
        'OPENING_HOURS': get_opening_hours_for_lang('en'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
    'ru': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': 'https://praxis-saewska.de/ru',
        'LOCALE': 'ru_RU.UTF-8',
        'OPENING_HOURS': get_opening_hours_for_lang('ru'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
    'uk': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': 'https://praxis-saewska.de/uk',
        'LOCALE': 'uk_UA.UTF-8',
        'OPENING_HOURS': get_opening_hours_for_lang('uk'),
        'CONTACT_INFO': CONTACT_INFO,
        'PRACTICE_INFO': PRACTICE_INFO,
        'CLOSED_TEXT': CLOSED_TEXT,
    },
}

# Disable debug
DEBUG = False

