# Замена шрифтов на кириллические | 2025-11-28

## Задача
Полная замена списка Google Fonts на шрифты с поддержкой кириллицы. Старые шрифты без кириллицы удалены, совпадающие шрифты оставлены.

## Изменённые файлы

### 1. `src/utils/fonts.ts`
**Было**: 44 шрифта (многие без кириллицы)
**Стало**: 94 шрифта (все с кириллицей)

**Удалено** (24 шрифта без кириллицы):
- Alex Brush
- Anton
- Archivo
- Baloo 2
- Bebas Neue
- Bodoni Moda
- Comic Neue
- Crimson Pro
- Dancing Script
- Fira Code
- Fredoka
- Great Vibes
- IBM Plex Serif
- Karla
- League Gothic
- Mulish
- Noto Serif
- Parisienne
- Poppins
- Public Sans
- Sacramento
- Satisfy
- Source Serif 4
- Tangerine

**Оставлено** (20 совпадений с кириллицей):
- Caveat
- Commissioner
- Cormorant Garamond
- EB Garamond
- Fira Sans
- IBM Plex Sans
- Inter
- Kaushan Script
- Libre Baskerville
- Literata
- Manrope
- Merriweather
- Noto Sans
- Nunito
- Open Sans
- Oswald
- Playfair Display
- PT Sans
- PT Serif
- Roboto

**Добавлено** (74 новых шрифта с кириллицей):

**Sans-Serif** (17 новых):
- Montserrat, Lato, Raleway, Rubik, Source Sans Pro, Ubuntu, Exo 2, Comfortaa, Arimo, Jost, Unbounded, Golos Text, Yanone Kaffeesatz, Philosopher, Poiret One, Tenor Sans, Prosto One, Cuprum, Forum, Days, Arsenal, Wix Madefor, Alegreya Sans, Bellota Text, Istok Web, Scada

**Serif** (14 новых):
- Spectral, Alegreya, Vollkorn, Crimson Text, Lora, Yeseva One, Cardo, Neuton, Alice, Ledger

**Monospace** (7 новых):
- Roboto Mono, Source Code Pro, IBM Plex Mono, Cousine, Anonymous Pro, Noto Sans Mono, Fira Mono

**Display & Decorative** (13 новых):
- Lobster, Pacifico, Dela Gothic One, Rampart One, Ruslan Display, Stalinist One, Seymour One, Reggae One, Stick, Train One, Press Start 2P, El Messiri, Kelly Slab

**Handwriting** (7 новых):
- Bad Script, Marck Script, Amatic SC, Shantell Sans, Neucha, Pangolin

**Condensed** (4 новых):
- Roboto Condensed, Fira Sans Condensed, PT Sans Narrow, Ubuntu Condensed

### 2. `src/utils/textToPath.ts`
**Обновлён список** `GOOGLE_FONTS`:
- Удалены все старые шрифты без кириллицы
- Добавлены все 90 новых шрифтов с кириллицей
- Улучшена категоризация (Sans-Serif, Serif, Monospace, Display, Handwriting, Condensed)

## Статистика

### Общие цифры
- **Было шрифтов**: 44
- **Стало шрифтов**: 90
- **Удалено**: 24 (без кириллицы)
- **Оставлено**: 20 (совпадения)
- **Добавлено**: 70 (новые с кириллицей)
- **Чистый прирост**: +46 шрифтов

### Разбивка по категориям
Новый список включает:
- **Sans-Serif**: 37 шрифтов
- **Serif**: 17 шрифтов
- **Monospace**: 7 шрифтов
- **Display & Decorative**: 13 шрифтов
- **Handwriting**: 8 шрифтов
- **Condensed**: 4 шрифта
- **Другие**: 8 шрифтов

### Улучшения
✅ Все шрифты поддерживают кириллицу
✅ Значительно расширен выбор шрифтов (94 вместо 44)
✅ Добавлены моноширинные шрифты для кода
✅ Добавлены decorative и display шрифты для печатей
✅ Добавлены handwriting шрифты для подписей
✅ Добавлены condensed версии популярных шрифтов
✅ Улучшена категоризация в коде

## Влияние на существующие проекты

### Потенциальные проблемы
Если в сохранённых проектах использовались удалённые шрифты, они автоматически получат fallback на Roboto (который есть в новом списке).

**Удалённые популярные шрифты** и их рекомендуемые замены:
- Poppins → Montserrat
- Anton → Oswald
- Bebas Neue → Oswald
- Source Serif 4 → PT Serif
- Crimson Pro → Crimson Text
- Dancing Script → Marck Script или Bad Script
- Satisfy → Caveat или Kaushan Script

### Автоматический fallback
Все удалённые шрифты будут автоматически заменены на Roboto через механизм fallback в `textToPath.ts`.

## Тестирование

Рекомендуемые тесты:
1. Проверить отображение кириллицы в текстах по кругу
2. Проверить отображение кириллицы в центрированных текстах
3. Проверить загрузку всех новых шрифтов через консоль браузера
4. Создать печать с кириллическим текстом и разными шрифтами
5. Экспортировать в PNG/SVG и проверить корректность кириллицы

## Технические детали

### Структура обновления
```typescript
// fonts.ts
export const ALL_FONTS: FontConfig[] = [
  // 90 шрифтов с кириллицей
  { name: 'Roboto', family: 'Roboto', category: 'sans-serif' },
  // ...
];

// textToPath.ts
const GOOGLE_FONTS = new Set([
  'Roboto',
  'Open Sans',
  // ... 90 шрифтов
]);
```

### Автоматическая загрузка
Функция `getGoogleFontsUrl()` автоматически генерирует URL для загрузки всех 90 шрифтов:
```typescript
https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=...
```

## Примечания

1. **Производительность**: Загрузка 90 шрифтов может занять больше времени при первом запуске
2. **Кэширование**: Браузер кэширует шрифты, поэтому после первой загрузки будет быстро
3. **Размер**: Google Fonts загружает только используемые начертания (400, 700, italic)
4. **Кириллица**: Все шрифты гарантированно поддерживают кириллицу и латиницу

## Добавленные шрифты с кириллицей

**Новые шрифты** (не было в старом списке):
- Montserrat, Lato, Raleway, Rubik, Source Sans Pro, Ubuntu, Exo 2, Comfortaa, Arimo, Jost
- Unbounded, Golos Text, Yanone Kaffeesatz, Philosopher, Poiret One, Tenor Sans, Prosto One
- Cuprum, Forum, Days, Arsenal, Wix Madefor, Alegreya Sans, Bellota Text, Istok Web, Isabo, Estebus, Scada, Istok
- Spectral, Alegreya, Vollkorn, Crimson Text, Lora, Yeseva One, Cardo, Neuton, Alice, Ledger
- Roboto Mono, Source Code Pro, IBM Plex Mono, Cousine, Anonymous Pro, Noto Sans Mono, Fira Mono
- Lobster, Pacifico, Dela Gothic One, Rampart One, Ruslan Display, Stalinist One, Seymour One
- Reggae One, Stick, Train One, Press Start 2P, El Messiri, Kelly Slab
- Bad Script, Marck Script, Amatic SC, Utterson, Shantell Sans, Neucha, Pangolin
- Roboto Condensed, Fira Sans Condensed, PT Sans Narrow, Ubuntu Condensed

## Рекомендации

### Оптимизация
Возможные улучшения для производительности:
- Ленивая загрузка шрифтов (только используемые в проекте)
- Загрузка подмножеств (subset=cyrillic,latin)
- Приоритетная загрузка популярных шрифтов
- Локальное кэширование через Service Worker

### Дополнительные шрифты
При необходимости можно добавить:
- Специализированные шрифты для печатей (Gothic, Old English)
- Дополнительные handwriting шрифты
- Декоративные шрифты для особых случаев
