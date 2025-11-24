# -*- coding: utf-8 -*-
"""
Production configuration for Praxis Saewska website
"""

from pelicanconf import *

# Production URL
SITEURL = 'https://praxis-saewska.de'
RELATIVE_URLS = False

# Update i18n_subsites with production URLs
I18N_SUBSITES = {
    'de': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': 'https://praxis-saewska.de',
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
        'SITEURL': 'https://praxis-saewska.de/en',
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
        'SITEURL': 'https://praxis-saewska.de/ru',
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
        'SITEURL': 'https://praxis-saewska.de/uk',
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

# Disable debug
DEBUG = False

