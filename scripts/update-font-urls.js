// Скрипт для получения актуальных URL шрифтов из Google Fonts
// Запускаем: node scripts/update-font-urls.js

const fonts = [
  'Alex Brush', 'Anton', 'Archivo', 'Baloo 2', 'Bebas Neue', 'Bodoni Moda',
  'Caveat', 'Commissioner', 'Comic Neue', 'Cormorant Garamond', 'Crimson Pro',
  'Dancing Script', 'EB Garamond', 'Fira Code', 'Fira Sans', 'Fredoka',
  'Great Vibes', 'IBM Plex Sans', 'IBM Plex Serif', 'Inter', 'Karla',
  'Kaushan Script', 'League Gothic', 'Libre Baskerville', 'Literata',
  'Manrope', 'Merriweather', 'Mulish', 'Noto Sans', 'Noto Serif', 'Nunito',
  'Open Sans', 'Oswald', 'Parisienne', 'Playfair Display', 'Poppins',
  'PT Sans', 'PT Serif', 'Public Sans', 'Roboto', 'Sacramento', 'Satisfy',
  'Source Serif 4', 'Tangerine', 'Ubuntu'
];

async function getFontUrl(fontFamily, weight = '400') {
  const googleFontName = fontFamily.replace(/\s+/g, '+');
  const cssUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@${weight}&display=swap`;

  try {
    const response = await fetch(cssUrl);
    const css = await response.text();

    // Извлекаем URL TTF файла из CSS
    const urlMatch = css.match(/src:\s*url\((https:\/\/[^)]+\.ttf)\)/);

    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${fontFamily}:`, error.message);
    return null;
  }
}

async function updateAllFonts() {
  const result = {};

  for (const font of fonts) {
    const normalUrl = await getFontUrl(font, '400');
    const boldUrl = await getFontUrl(font, '700');

    if (normalUrl || boldUrl) {
      result[font] = {};
      if (normalUrl) result[font]['normal-normal'] = normalUrl;
      if (boldUrl) result[font]['bold-normal'] = boldUrl;
    }

    // Небольшая задержка чтобы не спамить API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  console.log('const googleFontUrls: Record<string, Record<string, string>> = {');
  for (const [font, urls] of Object.entries(result)) {
    const urlsStr = Object.entries(urls)
      .map(([key, url]) => `'${key}': '${url}'`)
      .join(', ');
    console.log(`  '${font}': { ${urlsStr} },`);
  }
  console.log('};');
}

updateAllFonts();
