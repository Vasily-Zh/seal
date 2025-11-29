// Тест для проверки содержимого CSS-ответа от Google Fonts
async function testGoogleFontsCSS() {
  console.log('Проверяем CSS-ответ от Google Fonts для Roboto...');

  try {
    const fontName = 'Roboto';
    const encodedName = encodeURIComponent(fontName);
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@400&subset=cyrillic,latin&display=swap`;

    console.log('Запрашиваем URL:', cssUrl);
    
    const response = await fetch(cssUrl);
    if (!response.ok) {
      console.error(`Google Fonts CSS request failed: ${response.status}`);
      return;
    }

    const css = await response.text();
    console.log('Полученный CSS:');
    console.log(css);
    
    // Ищем все URL
    const allUrls = css.match(/url\(([^)]+)\)/g);
    console.log('\nВсе найденные URL в CSS:');
    allUrls?.forEach((url, index) => {
      console.log(`${index + 1}: ${url}`);
    });
    
  } catch (error) {
    console.error('Ошибка при тестировании:', error);
  }
}

testGoogleFontsCSS();