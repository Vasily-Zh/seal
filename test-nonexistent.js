import { convertCurvedTextToPath } from './src/utils/textToPath';

// Тест с несуществующим шрифтом для проверки обработки ошибок
async function testNonExistentFont() {
  console.log('Тестируем конвертацию с несуществующим шрифтом...');

  try {
    const svgPaths = await convertCurvedTextToPath(
      'ТЕСТ',
      50,    // cx
      50,    // cy
      30,    // radius
      6,     // fontSize
      'NonExistentFont12345',
      '#0000ff',
      0,     // startAngle
      false  // isFlipped
    );

    console.log('Результат конвертации:');
    console.log(svgPaths.substring(0, 200) + '...');
  } catch (error) {
    console.error('✗ Ожидаемая ошибка загрузки шрифта:', error.message);
  }
}

testNonExistentFont();