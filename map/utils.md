# Утилиты

Вспомогательные функции для работы с экспортом, шрифтами, SVG и т.д.

## Ключевые файлы
- [export.ts](src/utils/export.ts) - Экспорт в PNG/SVG/PDF/ZIP
- [fonts.ts](src/utils/fonts.ts) - Конфигурация шрифтов (все доступные шрифты)
- [svgValidator.ts](src/utils/svgValidator.ts) - Валидация SVG
- [svgOptimizer.ts](src/utils/svgOptimizer.ts) - Оптимизация SVG (встроенный алгоритм)
- [vectorize.ts](src/utils/vectorize.ts) - Векторизация изображений (только Potrace WASM)
- [textToPath.ts](src/utils/textToPath.ts) - Конвертация текста в SVG path через fontkit
- [extractSvgFromIcon.ts](src/utils/extractSvgFromIcon.ts) - Извлечение SVG из иконок
- [auth.ts](src/utils/auth.ts) - Аутентификация
- [projectStorage.ts](src/utils/projectStorage.ts) - Сохранение/загрузка проектов в localStorage

## Основные функции
- [exportToPNG](src/utils/export.ts) - Сохранение в PNG
- [exportToPNGTransparent](src/utils/export.ts) - Сохранение в PNG с прозрачным фоном
- [exportToSVG](src/utils/export.ts) - Сохранение в SVG
- [exportToPDF](src/utils/export.ts) - Сохранение в PDF
- [exportToZIP](src/utils/export.ts) - Сохранение всех форматов в ZIP
- [exportElementToSVG](src/utils/export.ts) - Экспорт отдельного элемента
- [vectorizeWithPotrace](src/utils/vectorize.ts) - Векторизация через Potrace WASM
- [isImageSuitableForPotrace](src/utils/vectorize.ts) - Проверка подходящести изображения
- [convertTextToPath](src/utils/textToPath.ts) - Конвертация текста в SVG path
- [convertCurvedTextToPath](src/utils/textToPath.ts) - Конвертация кривого текста в SVG path
- [preloadFont](src/utils/textToPath.ts) - Предзагрузка шрифта
- [clearFontCache](src/utils/textToPath.ts) - Очистка кэша шрифтов
- [optimizeSVG](src/utils/svgOptimizer.ts) - Оптимизация SVG
- [getOptimizationStats](src/utils/svgOptimizer.ts) - Статистика оптимизации
- [saveProject](src/utils/projectStorage.ts) - Сохранение проекта
- [loadProject](src/utils/projectStorage.ts) - Загрузка проекта
- [listProjects](src/utils/projectStorage.ts) - Список проектов
- [generateThumbnail](src/utils/projectStorage.ts) - Создание превью