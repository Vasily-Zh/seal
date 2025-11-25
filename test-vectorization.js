import { convertCurvedTextToPath } from './src/utils/textToPath';

// Простой тест для проверки работы векторизации кругового текста
async function testCurvedText() {
  console.log('Тестируем конвертацию кругового текста...');
  
  try {
    const svgPaths = await convertCurvedTextToPath(
      'ТЕСТ',
      50,    // cx
      50,    // cy
      30,    // radius
      6,     // fontSize
      'Arial, sans-serif',
      '#0000ff',
      0,     // startAngle
      false  // isFlipped
    );
    
    console.log('Результат конвертации:');
    console.log(svgPaths);
    console.log('✓ Конвертация кругового текста прошла успешно');
  } catch (error) {
    console.error('✗ Ошибка конвертации:', error);
  }
}

testCurvedText();