# Гайд по добавлению шрифтов

## Текущая ситуация

**Поддерживаемые шрифты для векторизации:**
- ✅ **Roboto** (локальный + прямой URL)
- ✅ **Open Sans** (прямой URL)
- ✅ **Inter** (прямой URL)
- ✅ **Anton** (локальный TTF)

**CSS-загруженные через fonts.css:**
- ✅ 44 Google Fonts (Archivo, Poppins, etc.)
- ✅ Используются только для отображения на странице
- ❌ НЕ могут быть использованы Fontkit (для векторизации)

## Как добавить новый шрифт для векторизации

### Способ 1: Локальный TTF (рекомендуется)

1. **Скачать TTF с Google Fonts**
   - Перейти на https://fonts.google.com/specimen/FontName
   - Download family → выбрать Regular (400 normal)
   - Распаковать и скопировать `FontName-Regular.ttf`

2. **Поместить в проект**
   ```
   public/fonts/FontName-Regular.ttf
   ```

3. **Добавить в fontLoader.ts**
   ```typescript
   const localFonts: Record<string, Record<string, string>> = {
     'FontName': {
       'normal-normal': '/fonts/FontName-Regular.ttf',
       'bold-normal': '/fonts/FontName-Bold.ttf', // если есть
     },
   };
   ```

4. **Проверить**
   ```javascript
   // В консоли браузера
   const result = await renderTextToPath({
     text: 'Test',
     fontFamily: 'FontName',
     fontSize: 20,
     x: 0, y: 0,
     color: '#000000',
     layoutType: 'straight'
   });
   console.log(result); // должно быть SVG с path элементами
   ```

### Способ 2: Известный Google Font URL

Если шрифт известен, можно добавить прямой URL:

```typescript
const googleFontUrls: Record<string, Record<string, string>> = {
  'NewFont': {
    'normal-normal': 'https://fonts.gstatic.com/s/newfont/v12/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
  },
};
```

### Способ 3: CSS-загруженный шрифт (только для отображения)

1. Добавить в `src/styles/fonts.css`:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=FontName:wght@400;700&display=swap');
   ```

2. Добавить в `src/utils/fonts.ts`:
   ```typescript
   {
     name: 'FontName',
     family: 'FontName',
     category: 'sans-serif',
   }
   ```

⚠️ **ВАЖНО**: Такие шрифты НЕ могут использоваться Fontkit!
Они работают только в CSS для отображения обычного текста.

## Форматы файлов

| Формат | Poддержка Fontkit | Размер | Примечание |
|--------|----------|--------|-----------|
| **TTF** | ✅ ДА | Средний | Оптимально для Fontkit |
| **OTF** | ✅ ДА | Средний | Также работает |
| WOFF | ❌ НЕТ | Маленький | Не поддерживается |
| WOFF2 | ❌ НЕТ | Очень маленький | Не поддерживается |
| EOT | ❌ НЕТ | - | Не поддерживается |

## Структура fontLoader.ts

```
getGoogleFontUrl(family, weight, style)
├─ Проверяет localFonts (/fonts/*.ttf)
├─ Проверяет googleFontUrls (прямые URL на TTF)
└─ Возвращает null (fallback на Roboto)
    └─ catch блок → загружает Roboto fallback
```

## Тестирование

После добавления шрифта, проверьте в консоли:

```javascript
// 1. Проверить загрузку
import fontkit from 'fontkit';
const response = await fetch('/fonts/FontName-Regular.ttf');
const buffer = await response.arrayBuffer();
const font = fontkit.create(Buffer.from(buffer));
console.log(font.familyName); // должно быть 'FontName'

// 2. Проверить рендеринг
const result = await renderTextToPath({
  text: 'ABC',
  fontFamily: 'FontName',
  fontSize: 20,
  x: 0, y: 0,
  color: '#000000',
  layoutType: 'straight'
});
console.log(result); // должны быть <path> элементы
```

## Ошибки и решения

### CORS ошибка при загрузке шрифта
❌ Проблема: `Access to fetch blocked by CORS`
✅ Решение: Использовать локальный TTF в `/public/fonts/`

### "Font not available for vectorization"
❌ Проблема: Шрифт только в CSS, не в маппинге
✅ Решение: Добавить TTF в fontLoader.ts

### Кракозябры вместо текста
❌ Проблема: Неправильный формат шрифта (WOFF2 вместо TTF)
✅ Решение: Убедиться что используется TTF или OTF

## Лимиты

- CSS-загруженные шрифты: **44 шрифта** (для отображения)
- TTF для векторизации: **добавляйте по мере необходимости**
- Рекомендуется: Regular (400) и Bold (700) веса
