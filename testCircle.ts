import { convertCurvedTextToPath } from './src/utils/textToPath.ts';
import { writeFileSync } from 'fs';

async function testCircle() {
  console.log('🧪 Тестируем математику кругового текста...');

  // Простой тест - один символ "A" по кругу
  const result = await convertCurvedTextToPath(
    "A",           // только один символ
    250, 250,      // центр в (250, 250)
    100,           // радиус 100
    50,            // размер шрифта 50
    "Impact.ttf",  // шрифт
    "#ff0000"      // красный
  );

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
  <rect width="500" height="500" fill="white"/>
  <!-- Центр круга -->
  <circle cx="250" cy="250" r="2" fill="black"/>
  <!-- Окружность радиусом 100 -->
  <circle cx="250" cy="250" r="100" fill="none" stroke="lightgray" stroke-width="1"/>
  ${result}
</svg>`;

  writeFileSync('test-circle.svg', svg);
  console.log('✅ Тест создан: test-circle.svg');
  console.log('Если символ A на окружности - математика верна!');
}

testCircle();