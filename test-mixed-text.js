import { convertCurvedTextToPath } from './src/utils/textToPath';

// Тест с кириллическими и латинскими символами
async function testMixedText() {
  console.log('Тестируем конвертацию с кириллическими и латинскими символами...');

  try {
    const svgPaths = await convertCurvedTextToPath(
      'ТЕСТ Test',
      50,    // cx
      50,    // cy
      6,     // fontSize
      'Roboto',
      '#0000ff', // color
      0,     // startAngle
      false  // isFlipped
    );

    console.log('Результат конвертации:');
    console.log(svgPaths.substring(0, 300) + '...'); // Show first 300 chars
    console.log('✓ Конвертация текста с кириллицей и латиницей прошла успешно');
  } catch (error) {
    console.error('✗ Ошибка конвертации:', error);
  }
}

testMixedText();