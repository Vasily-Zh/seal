import { convertTextToPath, convertCurvedTextToPath } from './src/utils/textToPath.ts';
import { writeFileSync } from 'fs';

async function generateSvg() {
  console.log('🎨 Генерация SVG с векторными шрифтами...');

  // Обычный текст
  const normalTextPath = await convertTextToPath(
    "ПРИМЕР",           // текст
    250, 250,          // координаты центра
    50,                // размер шрифта
    "ComicSansMS.ttf", // шрифт из папки public/fonts
    "#0000ff"          // цвет
  );

  // Круговой текст  
  const curvedTextPath = await convertCurvedTextToPath(
    "ПО КРУГУ",        // текст
    250, 250,          // координаты центра
    150,               // радиус окружности
    40,                // размер шрифта
    "Impact.ttf",      // шрифт из папки public/fonts
    "#ff0000"          // цвет
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="white"/>
  ${normalTextPath}
  ${curvedTextPath}
</svg>`;

  writeFileSync('output.svg', svg);
  console.log("✅ SVG готов! Откройте output.svg в CorelDRAW или Inkscape");
}

generateSvg();