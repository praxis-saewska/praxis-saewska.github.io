# Настройка i18n_subsites для Praxis Saewska

Этот проект использует плагин `i18n_subsites` для создания многоязычных подсайтов.

## Структура переводов

Переводы шаблонов хранятся в формате gettext:
```
themes/custom/translations/
├── de/LC_MESSAGES/messages.po  # Немецкий (основной язык)
├── en/LC_MESSAGES/messages.po  # Английский
├── ru/LC_MESSAGES/messages.po  # Русский
└── uk/LC_MESSAGES/messages.po  # Украинский
```

## Компиляция переводов

Перед генерацией сайта необходимо скомпилировать `.po` файлы в бинарные `.mo` файлы:

```bash
python compile_translations.py
```

Или вручную для каждого языка:
```bash
msgfmt -o themes/custom/translations/de/LC_MESSAGES/messages.mo themes/custom/translations/de/LC_MESSAGES/messages.po
msgfmt -o themes/custom/translations/en/LC_MESSAGES/messages.mo themes/custom/translations/en/LC_MESSAGES/messages.po
msgfmt -o themes/custom/translations/ru/LC_MESSAGES/messages.mo themes/custom/translations/ru/LC_MESSAGES/messages.po
msgfmt -o themes/custom/translations/uk/LC_MESSAGES/messages.mo themes/custom/translations/uk/LC_MESSAGES/messages.po
```

### Установка gettext

Если команда `msgfmt` не найдена, установите gettext:

- **macOS**: `brew install gettext`
- **Linux**: `sudo apt-get install gettext` или `sudo yum install gettext`
- **Windows**: Скачайте с https://mlocati.github.io/articles/gettext-iconv-windows.html

## Добавление новых переводов

1. Откройте соответствующий `.po` файл
2. Добавьте новую строку в формате:
   ```
   msgid "Original text"
   msgstr "Translated text"
   ```
3. Скомпилируйте переводы: `python compile_translations.py`
4. Перегенерируйте сайт

## Использование в шаблонах

В шаблонах Jinja2 используйте функцию `_()` для перевода строк:

```jinja2
{{ _('Startseite') }}
{{ _('Über uns') }}
```

## Конфигурация

Настройки i18n_subsites находятся в `pelicanconf.py`:

```python
I18N_SUBSITES = {
    'en': {
        'SITENAME': 'Praxis Saewska',
        'SITEURL': '/en',
        'LOCALE': 'en_US.UTF-8',
    },
    # ...
}
```

## Генерация сайта

После компиляции переводов сгенерируйте сайт:

```bash
# Разработка
uv run pelican content -s pelicanconf.py

# Продакшен
uv run pelican content -s publishconf.py
```

Плагин `i18n_subsites` автоматически создаст отдельные подсайты для каждого языка:
- Основной язык (de) генерируется в корне `output/`
- Дополнительные языки генерируются в подпапках: `output/en/`, `output/ru/`, `output/uk/`

## Важные замечания

1. **Метаданные страниц**: Каждая страница должна иметь метаданные `Lang:` и `Slug:` в заголовке
2. **Slug для группировки**: Страницы с одинаковым `Slug` считаются переводами друг друга
3. **Компиляция переводов**: Не забывайте компилировать `.po` файлы после изменений
4. **Переменные шаблонов**: Плагин предоставляет переменные `lang_siteurls`, `main_siteurl`, `main_lang` для навигации между языками

