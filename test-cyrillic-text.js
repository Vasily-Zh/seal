import { convertTextToPath } from './src/utils/textToPath';

// Тест для обычного (непо кругу) текста с кириллицей
async function testCyrillicText() {
  console.log('Тестируем конвертацию обычного текста с кириллицей...');

  try {
    const svgPath = await convertTextToPath(
      'ТЕСТ',      // text
      0,           // x
      0,           // y
      16,          // fontSize
      'Roboto',    // fontFamily
      '#ff0000',   // color
      'normal',    // fontWeight
      'normal'     // fontStyle
    );

    console.log('Результат конвертации (первые 200 символов):');
    console.log(svgPath.substring(0, 200) + '...');
    console.log('✓ Конвертация кириллического текста прошла успешно');
  } catch (error) {
    console.error('✗ Ошибка конвертации:', error);
  }
}

testCyrillicText();