# 🎨 Генерация SVG с векторными шрифтами

## Описание
Скрипт конвертирует текст в векторные пути SVG, избавляясь от зависимости от установленных шрифтов.

## Файлы
- `src/utils/textToPath.ts` - основные функции конвертации
- `generateSvgSimple.ts` - простой скрипт для генерации SVG
- `output.svg` - результат генерации

## Шрифты
Положите .ttf файлы в папку `public/fonts/`:
- `ComicSansMS.ttf`
- `Impact.ttf`

## Использование

### 1. Обычный текст
```typescript
import { convertTextToPath } from './src/utils/textToPath.ts';

const path = await convertTextToPath(
  "ТЕКСТ",           // текст
  250, 250,          // координаты центра
  50,                // размер шрифта
  "ComicSansMS.ttf", // шрифт
  "#0000ff"          // цвет
);
```

### 2. Круговой текст
```typescript
import { convertCurvedTextToPath } from './src/utils/textToPath.ts';

const path = await convertCurvedTextToPath(
  "ПО КРУГУ",        // текст
  250, 250,          // координаты центра
  150,               // радиус
  40,                // размер шрифта
  "Impact.ttf",      // шрифт
  "#ff0000"          // цвет
);
```

## Запуск

### Способ 1 (рекомендуемый):
```bash
npx ts-node generateSvgSimple.ts
```

### Способ 2 (через npm script):
Добавьте в package.json:
```json
{
  "scripts": {
    "generate-svg": "ts-node generateSvgSimple.ts"
  }
}
```
Затем:
```bash
npm run generate-svg
```

## Результат
- Создается файл `output.svg`
- Все шрифты полностью векторизованы
- Можно открывать в CorelDRAW, Inkscape без установки шрифтов
- Качество не зависит от масштабирования

## Пример
```typescript
import { convertTextToPath, convertCurvedTextToPath } from './src/utils/textToPath.ts';
import { writeFileSync } from 'fs';

async function generateSvg() {
  const normalTextPath = await convertTextToPath("ПРИМЕР", 250, 250, 50, "ComicSansMS.ttf", "#0000ff");
  const curvedTextPath = await convertCurvedTextToPath("ПО КРУГУ", 250, 250, 150, 40, "Impact.ttf", "#ff0000");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
    <rect width="500" height="500" fill="white"/>
    ${normalTextPath}
    ${curvedTextPath}
  </svg>`;

  writeFileSync('output.svg', svg);
  console.log("✅ SVG готов!");
}

generateSvg();