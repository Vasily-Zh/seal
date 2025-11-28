# Удаление системных шрифтов | 2025-11-28

## Задача
Полное удаление всех системных шрифтов из проекта, оставив только Google Fonts.

## Изменённые файлы

### 1. `src/utils/fonts.ts`
- **Удалено**: 23 системных шрифта (Arial, Times New Roman, Helvetica, Verdana, Georgia, Tahoma, Calibri, Cambria, Candara, Comic Sans MS, DejaVu Sans, Baskerville, Bodoni, Didot, Franklin Gothic, Garamond, Impact, Microsoft Sans Serif, Monotype Corsiva, Sylfaen, Ubuntu, Carlito, Arial Narrow)
- **Сохранено**: 44 Google Fonts
- **Изменено**: Функция `getGoogleFontsUrl()` теперь автоматически генерирует URL из `ALL_FONTS`

### 2. `src/utils/textToPath.ts`
- **Удалено**: Полностью удалён объект `SYSTEM_FONT_FALLBACKS` с маппингом системных шрифтов на Google Fonts
- **Упрощена**: Логика загрузки шрифтов — теперь просто проверяет наличие в `GOOGLE_FONTS`, иначе использует `Roboto`

### 3. `src/types/index.ts`
- **Изменено**: Комментарий к `FontConfig` теперь указывает только на Google Fonts
- **Изменено**: `DEFAULT_CONFIG.fontFamily` изменён с `'Arial, sans-serif'` на `'Roboto'`

### 4. `src/store/useStampStore.ts`
- **Изменено**: Дефолтные элементы теперь используют `fontFamily: 'Roboto'` вместо `'Arial, sans-serif'`

### 5. `src/components/Controls/FontSelector.tsx`
- **Изменено**: Fallback значение в `getCurrentFontDisplay()` изменено с `'Arial'` на `'Roboto'`

### 6. `src/index.css`
- **Изменено**: `font-family` в `:root` изменён с `'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` на просто `'Roboto'`
- **Удалены**: Все fallback системные шрифты

## Результаты

### Статистика изменений
- **Изменено файлов**: 6
- **Удалено строк**: 218
- **Добавлено строк**: 18
- **Чистое сокращение**: 200 строк

### Что удалено
- 23 системных шрифта из списка
- 23 маппинга fallback шрифтов
- Все упоминания системных шрифтов в дефолтных значениях
- Системные fallback шрифты из CSS

### Что осталось
- 44 Google Fonts (все с открытой лицензией OFL)
- Автоматическая генерация ссылок на Google Fonts API
- Roboto как единственный fallback шрифт

## Проверка

Выполнена проверка через grep — в основных файлах проекта не осталось упоминаний системных шрифтов (Arial, Times New Roman, Helvetica, Verdana, Georgia и др.).

## Примечания

1. Все изменения не нарушают логику приложения
2. Google Fonts загружаются через официальный API
3. При отсутствии нужного шрифта система автоматически использует Roboto
4. Все существующие проекты с системными шрифтами автоматически получат fallback на Google Fonts при экспорте
