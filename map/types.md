# Типы данных

TypeScript интерфейсы и типы для элементов печати.

## Ключевые файлы
- [index.ts](src/types/index.ts) - Все типы

## Основные типы
- [StampElement](src/types/index.ts:108) - Union тип всех элементов
- [BaseElement](src/types/index.ts:5) - Базовый интерфейс
- [CircleElement](src/types/index.ts:13) - Круг
- [TextElement](src/types/index.ts:22) - Текст по кругу (векторизуется через useCurvedTextVectorization)
- [TextCenteredElement](src/types/index.ts:39) - Центрированный текст (векторизуется через useCenteredTextVectorization)
- [IconElement](src/types/index.ts:80) - Иконка
- [StampStore](src/types/index.ts:103) - Интерфейс store
- [DEFAULT_CONFIG](src/types/index.ts:139) - Параметры по умолчанию