import * as fontkit from 'fontkit';
import svgpath from 'svgpath';

/**
 * Кэш загруженных шрифтов
 */
const fontCache = new Map<string, fontkit.Font>();

/**
 * Список Google Fonts с поддержкой кириллицы
 */
const GOOGLE_FONTS = new Set([
  // Sans-Serif
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Lato',
  'Oswald',
  'Raleway',
  'Noto Sans',
  'Rubik',
  'Source Sans Pro',
  'Ubuntu',
  'Inter',
  'Fira Sans',
  'IBM Plex Sans',
  'Nunito',
  'Exo 2',
  'Manrope',
  'Comfortaa',
  'Arimo',
  'Commissioner',
  'Jost',
  'Unbounded',
  'Golos Text',
  'Yanone Kaffeesatz',
  'Philosopher',
  'Poiret One',
  'Tenor Sans',
  'Prosto One',
  'Cuprum',
  'Forum',
  'Days',
  'Arsenal',
  'Wix Madefor',
  'PT Sans',
  'Alegreya Sans',
  'Bellota Text',
  'Istok Web',
  'Isabo',
  'Estebus',
  'Scada',
  'Istok',
  // Serif
  'Merriweather',
  'Playfair Display',
  'PT Serif',
  'Cormorant Garamond',
  'Spectral',
  'Alegreya',
  'Literata',
  'Vollkorn',
  'Crimson Text',
  'Libre Baskerville',
  'Lora',
  'EB Garamond',
  'Yeseva One',
  'Cardo',
  'Neuton',
  'Alice',
  'Ledger',
  // Monospace
  'Roboto Mono',
  'Source Code Pro',
  'IBM Plex Mono',
  'Cousine',
  'Anonymous Pro',
  'Noto Sans Mono',
  'Fira Mono',
  // Display & Decorative
  'Lobster',
  'Pacifico',
  'Dela Gothic One',
  'Rampart One',
  'Ruslan Display',
  'Stalinist One',
  'Seymour One',
  'Reggae One',
  'Stick',
  'Train One',
  'Press Start 2P',
  'El Messiri',
  'Kelly Slab',
  // Handwriting
  'Caveat',
  'Bad Script',
  'Marck Script',
  'Amatic SC',
  'Utterson',
  'Shantell Sans',
  'Neucha',
  'Pangolin',
  'Kaushan Script',
  // Condensed
  'Roboto Condensed',
  'Fira Sans Condensed',
  'PT Sans Narrow',
  'Ubuntu Condensed',
]);

/**
 * Извлекает базовое имя шрифта из CSS font-family строки
 */
function extractFontName(fontFamily: string): string {
  const first = fontFamily.split(',')[0].trim();
  return first.replace(/['"]/g, '');
}

/**
 * Получает URL шрифта из Google Fonts CSS API
 * Запрашиваем с subset для кириллицы
 */
async function getGoogleFontUrl(
  fontName: string,
  weight: string,
  style: string
): Promise<string | null> {
  try {
    const weightNum = weight === 'bold' ? '700' : '400';
    const encodedName = encodeURIComponent(fontName);
    
    // Добавляем subset=cyrillic,latin для поддержки кириллицы
    let cssUrl: string;
    if (style === 'italic') {
      cssUrl = `https://fonts.googleapis.com/css2?family=${encodedName}:ital,wght@1,${weightNum}&subset=cyrillic,latin&display=swap`;
    } else {
      cssUrl = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@${weightNum}&subset=cyrillic,latin&display=swap`;
    }

    const response = await fetch(cssUrl);
    if (!response.ok) {
      console.warn(`Google Fonts CSS request failed for ${fontName}: ${response.status}`);
      return null;
    }
    
    const css = await response.text();
    
    // Ищем URL для cyrillic subset (он идёт первым если доступен)
    // Формат: /* cyrillic */ @font-face { ... src: url(...) }
    const cyrillicMatch = css.match(/\/\*\s*cyrillic\s*\*\/[^}]*url\(([^)]+)\)/);
    if (cyrillicMatch) {
      console.log(`Found cyrillic subset for ${fontName}`);
      return cyrillicMatch[1];
    }
    
    // Если кириллицы нет, берём первый доступный URL (latin)
    const urlMatch = css.match(/url\(([^)]+)\)/);
    if (urlMatch) {
      console.log(`Using latin subset for ${fontName} (no cyrillic available)`);
      return urlMatch[1];
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching Google Font URL for ${fontName}:`, error);
    return null;
  }
}

/**
 * Загружает шрифт
 */
async function loadFont(
  fontFamily: string,
  fontWeight: string,
  fontStyle: string
): Promise<fontkit.Font> {
  const fontName = extractFontName(fontFamily);
  const cacheKey = `${fontName}-${fontWeight}-${fontStyle}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  let targetFont = fontName;

  if (!GOOGLE_FONTS.has(fontName)) {
    console.warn(`Font "${fontName}" not found in Google Fonts list, using Roboto as fallback`);
    targetFont = 'Roboto';
  } else {
    console.log(`Loading font: ${fontName}`);
  }

  try {
    const fontUrl = await getGoogleFontUrl(targetFont, fontWeight, fontStyle);
    
    if (fontUrl) {
      console.log(`Loading font: ${targetFont} from ${fontUrl}`);
      
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`Font download failed: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      const fontResult = fontkit.create(buffer as any);
      const font = 'fonts' in fontResult ? fontResult.fonts[0] : fontResult;
      
      fontCache.set(cacheKey, font);
      return font;
    }
    
    throw new Error(`Could not get font URL for ${targetFont}`);
  } catch (error) {
    console.error(`Font loading failed for ${fontName}:`, error);
    throw new Error(`Failed to load font: ${fontFamily}`);
  }
}

/**
 * Конвертирует path глифа fontkit в SVG path string
 * Fontkit использует систему координат шрифта (Y вверх), нужно инвертировать
 */
function glyphPathToSvg(glyph: any, fontSize: number, unitsPerEm: number): string {
  const scale = fontSize / unitsPerEm;
  const path = glyph.path;
  
  if (!path) return '';
  
  // Fontkit path.toSVG() возвращает SVG path string
  let svgString = '';
  
  if (typeof path.toSVG === 'function') {
    svgString = path.toSVG();
  } else if (path.commands) {
    // Ручная конвертация если toSVG недоступен
    for (const cmd of path.commands) {
      switch (cmd.type) {
        case 'moveTo':
          svgString += `M${cmd.x} ${cmd.y}`;
          break;
        case 'lineTo':
          svgString += `L${cmd.x} ${cmd.y}`;
          break;
        case 'curveTo':
          svgString += `C${cmd.cp1x} ${cmd.cp1y} ${cmd.cp2x} ${cmd.cp2y} ${cmd.x} ${cmd.y}`;
          break;
        case 'quadraticCurveTo':
          svgString += `Q${cmd.cp1x} ${cmd.cp1y} ${cmd.x} ${cmd.y}`;
          break;
        case 'closePath':
          svgString += 'Z';
          break;
      }
    }
  }
  
  if (!svgString) return '';
  
  // Применяем масштаб и инвертируем Y (шрифты имеют Y вверх, SVG - Y вниз)
  const transformed = svgpath(svgString)
    .scale(scale, -scale)
    .toString();
  
  return transformed;
}

/**
 * Получает данные глифа
 */
function getGlyphData(font: fontkit.Font, char: string, fontSize: number): { 
  path: string; 
  advance: number;
  bbox: { minX: number; minY: number; maxX: number; maxY: number } | null;
} {
  const codePoint = char.codePointAt(0) || 0;
  const glyph = font.glyphForCodePoint(codePoint);
  const scale = fontSize / font.unitsPerEm;
  
  const advance = (glyph.advanceWidth || 0) * scale;
  const path = glyphPathToSvg(glyph, fontSize, font.unitsPerEm);
  
  // Получаем bounding box если доступен
  let bbox = null;
  if (glyph.bbox) {
    bbox = {
      minX: glyph.bbox.minX * scale,
      minY: -glyph.bbox.maxY * scale, // Инвертируем Y
      maxX: glyph.bbox.maxX * scale,
      maxY: -glyph.bbox.minY * scale, // Инвертируем Y
    };
  }
  
  return { path, advance, bbox };
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
    
    const paths: string[] = [];
    let currentX = 0;
    let minY = 0;
    let maxY = 0;
    
    // Собираем все глифы и вычисляем размеры
    const glyphsData: Array<{ path: string; x: number; advance: number }> = [];
    
    for (const char of text) {
      if (char === ' ') {
        const spaceGlyph = font.glyphForCodePoint(32);
        const scale = fontSize / font.unitsPerEm;
        const spaceWidth = (spaceGlyph.advanceWidth || fontSize * 0.25) * scale;
        currentX += spaceWidth;
        continue;
      }
      
      const { path, advance, bbox } = getGlyphData(font, char, fontSize);
      
      if (path) {
        glyphsData.push({ path, x: currentX, advance });
        
        if (bbox) {
          minY = Math.min(minY, bbox.minY);
          maxY = Math.max(maxY, bbox.maxY);
        }
      }
      
      currentX += advance;
    }
    
    // Общая ширина текста
    const totalWidth = currentX;
    
    // Базовая линия
    const baselineOffset = maxY || fontSize * 0.75;
    
    // Собираем финальные пути с позиционированием
    for (const glyph of glyphsData) {
      const transformedPath = svgpath(glyph.path)
        .translate(glyph.x - totalWidth / 2, baselineOffset)
        .translate(x, y)
        .toString();
      
      paths.push(transformedPath);
    }
    
    if (paths.length === 0) {
      throw new Error('No paths generated');
    }
    
    // Объединяем все пути в один
    const combinedPath = paths.join(' ');

    return `<path d="${combinedPath}" fill="${color}"/>`;
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
    const scale = fontSize / font.unitsPerEm;

    // Собираем данные о символах
    interface CharData {
      char: string;
      advance: number;
      isSpace: boolean;
      path?: string;
      bbox?: { minX: number; minY: number; maxX: number; maxY: number } | null;
    }
    
    let totalWidth = 0;
    const charData: CharData[] = [];

    for (const char of text) {
      if (char === ' ') {
        const spaceGlyph = font.glyphForCodePoint(32);
        const advance = (spaceGlyph.advanceWidth || fontSize * 0.25) * scale;
        charData.push({ char, advance, isSpace: true });
        totalWidth += advance;
      } else {
        const { path, advance, bbox } = getGlyphData(font, char, fontSize);
        charData.push({ char, advance, isSpace: false, path, bbox });
        totalWidth += advance;
      }
    }

    // Проверяем, не превышает ли текст длину окружности
    const circumference = 2 * Math.PI * radius;
    let actualFontSize = fontSize;
    let actualScale = scale;
    
    if (totalWidth > circumference * 0.9) {
      const scaleFactor = (circumference * 0.9) / totalWidth;
      actualFontSize = fontSize * scaleFactor;
      actualScale = actualFontSize / font.unitsPerEm;
      
      // Пересчитываем с новым размером
      totalWidth = 0;
      charData.length = 0;

      for (const char of text) {
        if (char === ' ') {
          const spaceGlyph = font.glyphForCodePoint(32);
          const advance = (spaceGlyph.advanceWidth || actualFontSize * 0.25) * actualScale;
          charData.push({ char, advance, isSpace: true });
          totalWidth += advance;
        } else {
          const { path, advance, bbox } = getGlyphData(font, char, actualFontSize);
          charData.push({ char, advance, isSpace: false, path, bbox });
          totalWidth += advance;
        }
      }
    }

    // Рассчитываем начальный угол для центрирования
    const textArcAngle = totalWidth / radius;
    const startAngleRad = (startAngle * Math.PI) / 180;

    let currentAngle: number;
    if (isFlipped) {
      currentAngle = startAngleRad + textArcAngle / 2;
    } else {
      currentAngle = startAngleRad - textArcAngle / 2;
    }

    // Размещаем каждый символ
    for (const data of charData) {
      if (data.isSpace) {
        if (isFlipped) {
          currentAngle -= data.advance / radius;
        } else {
          currentAngle += data.advance / radius;
        }
        continue;
      }

      const { advance, path, bbox } = data;

      if (!path) {
        if (isFlipped) {
          currentAngle -= advance / radius;
        } else {
          currentAngle += advance / radius;
        }
        continue;
      }

      // Позиционирование по центру символа
      if (isFlipped) {
        currentAngle -= (advance / 2) / radius;
      } else {
        currentAngle += (advance / 2) / radius;
      }

      // Позиция на окружности
      const charX = cx + Math.cos(currentAngle) * radius;
      const charY = cy + Math.sin(currentAngle) * radius;

      // Угол поворота глифа
      let rotationRad = currentAngle + Math.PI / 2;
      if (isFlipped) {
        rotationRad -= Math.PI;
      }
      const rotationDeg = (rotationRad * 180) / Math.PI;

      // Центр глифа для трансформации
      // bbox уже в масштабированных координатах с инвертированным Y
      let glyphCenterX = advance / 2;
      let glyphCenterY = 0;
      
      if (bbox) {
        glyphCenterX = (bbox.minX + bbox.maxX) / 2;
        glyphCenterY = (bbox.minY + bbox.maxY) / 2;
      }

      // Применяем трансформации
      const transformedPath = svgpath(path)
        .translate(-glyphCenterX, -glyphCenterY)
        .rotate(rotationDeg, 0, 0)
        .translate(charX, charY)
        .toString();

      paths.push(`<path d="${transformedPath}" fill="${color}"/>`);

      // Вторая половина advance
      if (isFlipped) {
        currentAngle -= (advance / 2) / radius;
      } else {
        currentAngle += (advance / 2) / radius;
      }
    }

    if (paths.length === 0) {
      throw new Error('No paths generated for curved text');
    }

    return paths.join('\n');
  } catch (error) {
    console.error('Error converting curved text to path:', error);
    
    // Fallback на textPath
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

/**
 * Предзагрузка шрифта
 */
export async function preloadFont(
  fontFamily: string,
  fontWeight: string = 'normal',
  fontStyle: string = 'normal'
): Promise<boolean> {
  try {
    await loadFont(fontFamily, fontWeight, fontStyle);
    return true;
  } catch {
    return false;
  }
}

/**
 * Очистка кэша шрифтов
 */
export function clearFontCache(): void {
  fontCache.clear();
}