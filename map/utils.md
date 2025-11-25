# Утилиты

Вспомогательные функции для работы с экспортом, шрифтами, SVG и т.д.

## Ключевые файлы
- [export.ts](src/utils/export.ts) - Экспорт в PNG/SVG
- [fonts.ts](src/utils/fonts.ts) - Конфигурация шрифтов (44 Google Fonts + 22 системных)
- [textToPath.ts](src/utils/textToPath.ts) - Конвертация текста в SVG paths через opentype.js
- [svgValidator.ts](src/utils/svgValidator.ts) - Валидация SVG
- [vectorize.ts](src/utils/vectorize.ts) - Векторизация изображений (Potrace/ImageTracer)
- [extractSvgFromIcon.ts](src/utils/extractSvgFromIcon.ts) - Извлечение SVG из иконок
- [auth.ts](src/utils/auth.ts) - Аутентификация

## Основные функции
- [exportToPNG](src/utils/export.ts) - Сохранение в PNG
- [exportToSVG](src/utils/export.ts) - Сохранение в SVG
- [convertTextToPath](src/utils/textToPath.ts) - Конвертация текста в векторные пути (opentype.js)
- [convertCurvedTextToPath](src/utils/textToPath.ts) - Конвертация текста по окружности
- [vectorizeImage](src/utils/vectorize.ts) - Конвертация изображений в SVG

## Font Loading System (обновлено 2025-11-26)
**`textToPath.ts` содержит:**
- `systemFontUrls` - Эквиваленты системных шрифтов (Arial → Arimo, Georgia → Crimson Pro и т.д.)
- `googleFontUrls` - Полный список 22 Google Fonts с прямыми ссылками на TTF
- `loadFont()` - Функция загрузки шрифтов с кэшированием и fallback на Roboto
- `convertTextToPath()` - Конвертация обычного текста в SVG paths через opentype.js
- `convertCurvedTextToPath()` - Конвертация текста по окружности