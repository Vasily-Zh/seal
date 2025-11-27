import { convertTextToPath, convertCurvedTextToPath } from './src/utils/textToPath.ts'; // твой файл с функциями
import fs from 'fs';

async function main() {
  console.log('Начинаю генерацию SVG...');
  
  try {
    // Обычный текст
    console.log('Генерирую обычный текст...');
    const normalPath = await convertTextToPath(
      "ПРИМЕР",
      250,
      250,
      50,
      "ComicSansMS.ttf",
      "#0000ff"
    );

    // Круговой текст
    console.log('Генерирую круговой текст...');
    const curvedPath = await convertCurvedTextToPath(
      "ПО КРУГУ",
      250,
      250,
      150,
      40,
      "Impact.ttf",
      "#ff0000"
    );

    // Формируем SVG
    const svg = `<svg width="500" height="500" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" fill="white"/>
  ${normalPath}
  ${curvedPath}
</svg>`;

    fs.writeFileSync('./output.svg', svg);
    console.log('✅ SVG сгенерирован: output.svg');
    console.log('Теперь можно открыть output.svg в CorelDRAW или Inkscape');
  } catch (error) {
    console.error('❌ Ошибка при генерации SVG:', error);
  }
}

main();