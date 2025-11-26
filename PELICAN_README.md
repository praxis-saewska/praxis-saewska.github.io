# Pelican Migration - Praxis Saewska Website

## Структура проекта

```
praxis-saewska/
├── content/
│   └── pages/
│       ├── index.md (главная страница - немецкий)
│       ├── about.de.md
│       ├── faq.de.md
│       ├── privacy.de.md
│       └── impressum.de.md
├── themes/
│   └── custom/
│       ├── templates/
│       │   ├── base.html
│       │   ├── index.html
│       │   ├── page.html
│       │   └── 404.html
│       └── static/
│           ├── css/
│           │   └── styles.css
│           ├── js/
│           │   ├── script.js
│           │   └── common-data.js
│           └── images/
├── pelicanconf.py
├── publishconf.py
├── pyproject.toml
└── output/ (генерируется)
```

## Установка и запуск

### Установка зависимостей
```bash
uv sync
```

### Генерация сайта (разработка)
```bash
uv run pelican content -s pelicanconf.py
```

### Генерация сайта (продакшен)
```bash
uv run pelican content -s publishconf.py
```

### Локальный просмотр
```bash
cd output && python -m http.server 8000
```

## Многоязычность (i18n_subsites)

Для полной реализации многоязычности через i18n_subsites нужно:

1. Создать версии страниц для каждого языка в отдельных папках:
   - `content/en/pages/` - английские версии
   - `content/ru/pages/` - русские версии
   - `content/ua/pages/` - украинские версии

2. Создать конфигурационные файлы для каждого языка:
   - `content/en/pelicanconf.py`
   - `content/ru/pelicanconf.py`
   - `content/ua/pelicanconf.py`

3. Запустить генерацию для каждого языка:
   ```bash
   uv run pelican content/en -s content/en/pelicanconf.py -o output/en
   uv run pelican content/ru -s content/ru/pelicanconf.py -o output/ru
   uv run pelican content/ua -s content/ua/pelicanconf.py -o output/ua
   ```

## Текущий статус

✅ Базовая структура Pelican создана
✅ Шаблоны Jinja2 созданы
✅ Контент на немецком языке мигрирован
✅ Статические файлы скопированы
✅ JavaScript адаптирован для языковых подсайтов
✅ Генерация работает для основного языка (de)

⚠️ Версии страниц для других языков (en/ru/ua) нужно создать вручную или через скрипт

## Следующие шаги

1. Создать версии страниц для других языков (en, ru, ua)
2. Настроить полную генерацию для всех языков через i18n_subsites
3. Протестировать все языковые версии
4. Настроить деплоймент на GitHub Pages

