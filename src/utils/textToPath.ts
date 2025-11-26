import opentype from 'opentype.js';
import svgpath from 'svgpath';

/**
 * Кэш загруженных шрифтов
 */
const fontCache = new Map<string, opentype.Font>();

/**
 * Кэш URL шрифтов
 */
const fontUrlCache = new Map<string, string>();

/**
 * Маппинг системных шрифтов на Google Fonts эквиваленты
 */
const systemToGoogleFont: Record<string, string> = {
  'Arial': 'Roboto',
  'Georgia': 'Noto Serif',
  'Times New Roman': 'Noto Serif',
  'Verdana': 'Open Sans',
  'Courier New': 'Fira Code',
  'Impact': 'Oswald',
  'Tahoma': 'Roboto',
  'Helvetica': 'Roboto',
};

/**
 * ПРОВЕРЕННЫЕ TTF URL через jsDelivr CDN
 * Только шрифты с гарантированно рабочими ссылками
 * Оптимизировано для конструктора печатей и штампов
 */
const directTtfUrls: Record<string, Record<string, string>> = {
  // ============================================
  // ОСНОВНЫЕ ШРИФТЫ ДЛЯ ПЕЧАТЕЙ (чёткие, строгие)
  // ============================================
  
  // Roboto — универсальный, отлично читается на печатях
  'Roboto': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/Roboto-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/roboto@main/src/hinted/Roboto-Bold.ttf',
  },
  
  // Open Sans — чистый, профессиональный
  'Open Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-Bold.ttf',
  },
  
  // Noto Sans — поддержка кириллицы отличная
  'Noto Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSans/hinted/ttf/NotoSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSans/hinted/ttf/NotoSans-Bold.ttf',
  },
  
  // Noto Serif — классический serif для официальных печатей
  'Noto Serif': {
    '400': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSerif/hinted/ttf/NotoSerif-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/notofonts/latin@main/fonts/NotoSerif/hinted/ttf/NotoSerif-Bold.ttf',
  },
  
  // Oswald — узкий, отлично для круговых надписей
  'Oswald': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/OswaldFont@main/fonts/ttf/Oswald-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/OswaldFont@main/fonts/ttf/Oswald-Bold.ttf',
  },
  
  // Montserrat — современный, геометричный
  'Montserrat': {
    '400': 'https://cdn.jsdelivr.net/gh/JulietaUla/Montserrat@master/fonts/ttf/Montserrat-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/JulietaUla/Montserrat@master/fonts/ttf/Montserrat-Bold.ttf',
  },
  
  // Inter — современный, чёткий
  'Inter': {
    '400': 'https://cdn.jsdelivr.net/gh/rsms/inter@master/docs/font-files/Inter-Regular.otf',
    '700': 'https://cdn.jsdelivr.net/gh/rsms/inter@master/docs/font-files/Inter-Bold.otf',
  },
  
  // Ubuntu — дружелюбный, читаемый
  'Ubuntu': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/ubuntu@main/fonts/ttf/Ubuntu-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/ubuntu@main/fonts/ttf/Ubuntu-Bold.ttf',
  },
  
  // Nunito — мягкий, округлый
  'Nunito': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/nunito@main/fonts/ttf/Nunito-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/nunito@main/fonts/ttf/Nunito-Bold.ttf',
  },
  
  // Poppins — геометричный, современный
  'Poppins': {
    '400': 'https://cdn.jsdelivr.net/gh/itfoundry/poppins@master/products/Poppins-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/itfoundry/poppins@master/products/Poppins-Bold.ttf',
  },

  // ============================================
  // SERIF ШРИФТЫ (для официальных документов)
  // ============================================
  
  // Playfair Display — элегантный, для премиум печатей
  'Playfair Display': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/Playfair@main/fonts/ttf/PlayfairDisplay-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/Playfair@main/fonts/ttf/PlayfairDisplay-Bold.ttf',
  },
  
  // Merriweather — отличная читаемость
  'Merriweather': {
    '400': 'https://cdn.jsdelivr.net/gh/SorkinType/Merriweather@master/fonts/ttf/Merriweather-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/SorkinType/Merriweather@master/fonts/ttf/Merriweather-Bold.ttf',
  },
  
  // Libre Baskerville — классический книжный
  'Libre Baskerville': {
    '400': 'https://cdn.jsdelivr.net/gh/impallari/Libre-Baskerville@master/src/LibreBaskerville-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/impallari/Libre-Baskerville@master/src/LibreBaskerville-Bold.ttf',
  },
  
  // IBM Plex Sans — корпоративный
  'IBM Plex Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Sans/fonts/complete/ttf/IBMPlexSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Sans/fonts/complete/ttf/IBMPlexSans-Bold.ttf',
  },
  
  // IBM Plex Serif — корпоративный serif
  'IBM Plex Serif': {
    '400': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Serif/fonts/complete/ttf/IBMPlexSerif-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/IBM/plex@master/IBM-Plex-Serif/fonts/complete/ttf/IBMPlexSerif-Bold.ttf',
  },
  
  // Source Serif — Adobe, качественный
  'Source Serif': {
    '400': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-serif@release/TTF/SourceSerif4-Bold.ttf',
  },
  
  // Fira Sans — Mozilla, чёткий
  'Fira Sans': {
    '400': 'https://cdn.jsdelivr.net/gh/mozilla/Fira@master/ttf/FiraSans-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/mozilla/Fira@master/ttf/FiraSans-Bold.ttf',
  },

  // ============================================
  // DISPLAY ШРИФТЫ (для заголовков на печатях)
  // ============================================
  
  // Anton — жирный, заметный
  'Anton': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/Anton@main/fonts/Anton-Regular.ttf',
  },
  
  // Raleway — элегантный thin/bold
  'Raleway': {
    '400': 'https://cdn.jsdelivr.net/gh/impallari/Raleway@master/fonts/v4020/Raleway-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/impallari/Raleway@master/fonts/v4020/Raleway-Bold.ttf',
  },

  // ============================================
  // МОНОШИРИННЫЕ (для номеров, кодов на печатях)
  // ============================================
  
  // Fira Code — для номеров документов
  'Fira Code': {
    '400': 'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@master/distr/ttf/FiraCode-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/tonsky/FiraCode@master/distr/ttf/FiraCode-Bold.ttf',
  },
  
  // JetBrains Mono — чёткий моноширинный
  'JetBrains Mono': {
    '400': 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Bold.ttf',
  },
  
  // Source Code Pro — Adobe моноширинный
  'Source Code Pro': {
    '400': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-code-pro@release/TTF/SourceCodePro-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/adobe-fonts/source-code-pro@release/TTF/SourceCodePro-Bold.ttf',
  },

  // ============================================
  // РУКОПИСНЫЕ (для подписей, декоративных печатей)
  // ============================================
  
  // Dancing Script — элегантный рукописный
  'Dancing Script': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/DancingScript@main/fonts/ttf/DancingScript-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/DancingScript@main/fonts/ttf/DancingScript-Bold.ttf',
  },
  
  // Caveat — естественный почерк
  'Caveat': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/caveat@main/fonts/ttf/Caveat-Regular.ttf',
    '700': 'https://cdn.jsdelivr.net/gh/googlefonts/caveat@main/fonts/ttf/Caveat-Bold.ttf',
  },
  
  // Pacifico — дружелюбный script
  'Pacifico': {
    '400': 'https://cdn.jsdelivr.net/gh/googlefonts/Pacifico@main/fonts/ttf/Pacifico-Regular.ttf',
  },
};

/**
 * Получает URL TTF файла шрифта
 */
async function getFontUrl(fontFamily: string, fontWeight: string = 'normal'): Promise<string> {
  const googleFontName = systemToGoogleFont[fontFamily] || fontFamily;
  const weight = fontWeight === 'bold' ? '700' : '400';
  const cacheKey = `${googleFontName}-${weight}`;
  
  if (fontUrlCache.has(cacheKey)) {
    return fontUrlCache.get(cacheKey)!;
  }
  
  // Проверяем прямые URL
  const directUrl = directTtfUrls[googleFontName]?.[weight] || directTtfUrls[googleFontName]?.['400'];
  if (directUrl) {
    fontUrlCache.set(cacheKey, directUrl);
    return directUrl;
  }
  
  // Fallback на Roboto
  const robotoUrl = directTtfUrls['Roboto'][weight] || directTtfUrls['Roboto']['400'];
  fontUrlCache.set(cacheKey, robotoUrl);
  return robotoUrl;
}

/**
 * Загружает шрифт
 */
async function loadFont(fontFamily: string, fontWeight: string, fontStyle: string): Promise<opentype.Font> {
  const cacheKey = `${fontFamily}-${fontWeight}-${fontStyle}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  const fontsToTry = [fontFamily];
  if (fontFamily !== 'Roboto') fontsToTry.push('Roboto');

  let lastError: Error | null = null;

  for (const font of fontsToTry) {
    try {
      const fontUrl = await getFontUrl(font, fontWeight);
      
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      // Проверяем сигнатуру
      const signature = new Uint8Array(arrayBuffer.slice(0, 4));
      const signatureStr = String.fromCharCode(...signature);
      
      if (signatureStr === 'wOF2') {
        throw new Error('WOFF2 not supported');
      }
      
      const parsedFont = opentype.parse(arrayBuffer);
      fontCache.set(cacheKey, parsedFont);
      
      if (font !== fontFamily) {
        console.debug(`Using "${font}" instead of "${fontFamily}"`);
      }
      
      return parsedFont;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw new Error(`Failed to load font: ${lastError?.message}`);
}

/**
 * Конвертирует текст в SVG path
 */
export async function convertTextToPath(
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontFamily: string,
  color: string,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal'
): Promise<string> {
  try {
    const font = await loadFont(fontFamily, fontWeight, fontStyle);
    const path = font.getPath(text, 0, 0, fontSize);

    let pathData = '';
    path.commands.forEach((cmd: opentype.PathCommand) => {
      if (cmd.type === 'M') {
        pathData += `M ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'L') {
        pathData += `L ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'C') {
        pathData += `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'Q') {
        pathData += `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'Z') {
        pathData += 'Z ';
      }
    });

    const bbox = path.getBoundingBox();
    const bboxCenterX = (bbox.x1 + bbox.x2) / 2;
    const bboxCenterY = (bbox.y1 + bbox.y2) / 2;

    const transformedPath = svgpath(pathData)
      .translate(-bboxCenterX, -bboxCenterY)
      .translate(x, y)
      .toString();

    return `<path d="${transformedPath}" fill="${color}"/>`;
  } catch (error) {
    console.error('Error converting text to path:', error);
    return `<text x="${x}" y="${y}" fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" font-style="${fontStyle}" text-anchor="middle" dominant-baseline="middle">${text}</text>`;
  }
}

/**
 * Конвертирует круговой текст в paths
 */
export async function convertCurvedTextToPath(
  text: string,
  cx: number,
  cy: number,
  radius: number,
  fontSize: number,
  fontFamily: string,
  color: string,
  startAngle: number = 0,
  isFlipped: boolean = false,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal'
): Promise<string> {
  try {
    const font = await loadFont(fontFamily, fontWeight, fontStyle);
    const paths: string[] = [];

    let totalWidth = 0;
    const charData: Array<{
      char: string;
      advance: number;
      isSpace: boolean;
      glyphPath?: opentype.Path;
    }> = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const advance = font.getAdvanceWidth(char, fontSize);

      if (char === ' ') {
        charData.push({ char, advance, isSpace: true });
      } else {
        const glyphPath = font.getPath(char, 0, 0, fontSize);
        charData.push({ char, advance, isSpace: false, glyphPath });
      }
      totalWidth += advance;
    }

    const circumference = 2 * Math.PI * radius;
    if (totalWidth > circumference * 0.9) {
      const scale = (circumference * 0.9) / totalWidth;
      fontSize = fontSize * scale;

      totalWidth = 0;
      charData.length = 0;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const advance = font.getAdvanceWidth(char, fontSize);

        if (char === ' ') {
          charData.push({ char, advance, isSpace: true });
        } else {
          const glyphPath = font.getPath(char, 0, 0, fontSize);
          charData.push({ char, advance, isSpace: false, glyphPath });
        }
        totalWidth += advance;
      }
    }

    const textArcAngle = totalWidth / radius;
    const startAngleRad = (startAngle * Math.PI) / 180;

    let currentAngle = isFlipped 
      ? startAngleRad + textArcAngle / 2 
      : startAngleRad - textArcAngle / 2;

    for (let i = 0; i < charData.length; i++) {
      const data = charData[i];

      if (data.isSpace) {
        currentAngle += (isFlipped ? -1 : 1) * data.advance / radius;
        continue;
      }

      const { advance, glyphPath } = data;
      if (!glyphPath) continue;

      let pathData = '';
      glyphPath.commands.forEach((cmd: opentype.PathCommand) => {
        if (cmd.type === 'M') {
          pathData += `M ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'L') {
          pathData += `L ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'C') {
          pathData += `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'Q') {
          pathData += `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'Z') {
          pathData += 'Z ';
        }
      });

      if (!pathData) {
        currentAngle += (isFlipped ? -1 : 1) * advance / radius;
        continue;
      }

      const bbox = glyphPath.getBoundingBox();
      const centerX = (bbox.x1 + bbox.x2) / 2;
      const centerY = (bbox.y1 + bbox.y2) / 2;

      currentAngle += (isFlipped ? -1 : 1) * (advance / 2) / radius;

      const charX = cx + Math.cos(currentAngle) * radius;
      const charY = cy + Math.sin(currentAngle) * radius;

      let rotationRad = currentAngle + Math.PI / 2;
      if (isFlipped) {
        rotationRad -= Math.PI;
      }

      const rotationDeg = (rotationRad * 180) / Math.PI;

      const transformedPath = svgpath(pathData)
        .translate(-centerX, -centerY)
        .rotate(rotationDeg, 0, 0)
        .translate(charX, charY)
        .toString();

      paths.push(`<path d="${transformedPath}" fill="${color}"/>`);

      currentAngle += (isFlipped ? -1 : 1) * (advance / 2) / radius;
    }

    return paths.join('\n');
  } catch (error) {
    console.error('Error converting curved text to path:', error);
    
    const pathId = `fallback-path-${Date.now()}`;
    const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = cx + radius * Math.cos(((startAngle + 180) * Math.PI) / 180);
    const y2 = cy + radius * Math.sin(((startAngle + 180) * Math.PI) / 180);
    const sweepFlag = isFlipped ? 0 : 1;
    const pathD = `M ${x1},${y1} A ${radius},${radius} 0 0,${sweepFlag} ${x2},${y2} A ${radius},${radius} 0 0,${sweepFlag} ${x1},${y1}`;

    return `
      <defs>
        <path id="${pathId}" d="${pathD}" fill="none"/>
      </defs>
      <text fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" font-style="${fontStyle}">
        <textPath href="#${pathId}" startOffset="50%" text-anchor="middle">${text}</textPath>
      </text>
    `;
  }
}