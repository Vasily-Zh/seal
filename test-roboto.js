import { convertCurvedTextToPath } from './src/utils/textToPath';

// Тест с шрифтом, который есть в Google Fonts
async function testRobotoFont() {
  console.log('Тестируем конвертацию кругового текста с Roboto...');

  try {
    const svgPaths = await convertCurvedTextToPath(
      'ТЕСТ',
      50,    // cx
      50,    // cy
      30,    // radius
      6,     // fontSize
      'Roboto',
      '#0000ff',
      0,     // startAngle
      false  // isFlipped
    );

    console.log('Результат конвертации:');
    console.log(svgPaths.substring(0, 200) + '...'); // Show first 200 chars
    console.log('✓ Конвертация кругового текста с Roboto прошла успешно');
  } catch (error) {
    console.error('✗ Ошибка конвертации:', error);
  }
}

testRobotoFont();