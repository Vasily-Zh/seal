import * as fontkit from 'fontkit';
import svgpath from 'svgpath';

/**
 * Кэш загруженных шрифтов
 */
const fontCache = new Map<string, fontkit.Font>();

/**
 * Список Google Fonts которые поддерживаются
 */
const GOOGLE_FONTS = new Set([
  'Alex Brush',
  'Anton',
  'Archivo',
  'Baloo 2',
  'Bebas Neue',
  'Bodoni Moda',
  'Caveat',
  'Commissioner',
  'Comic Neue',
  'Cormorant Garamond',
  'Crimson Pro',
  'Dancing Script',
  'EB Garamond',
  'Fira Code',
  'Fira Sans',
  'Fredoka',
  'Great Vibes',
  'IBM Plex Sans',
  'IBM Plex Serif',
  'Inter',
  'Karla',
  'Kaushan Script',
  'League Gothic',
  'Libre Baskerville',
  'Literata',
  'Manrope',
  'Merriweather',
  'Mulish',
  'Noto Sans',
  'Noto Serif',
  'Nunito',
  'Open Sans',
  'Oswald',
  'Parisienne',
  'Playfair Display',
  'Poppins',
  'PT Sans',
  'PT Serif',
  'Public Sans',
  'Roboto',
  'Sacramento',
  'Satisfy',
  'Source Serif 4',
  'Tangerine',
]);

/**
 * Fallback шрифты для системных шрифтов
 */
const SYSTEM_FONT_FALLBACKS: Record<string, string> = {
  'Arial': 'Roboto',
  'Arial Narrow': 'Roboto',
  'Helvetica': 'Roboto',
  'Times New Roman': 'PT Serif',
  'Georgia': 'Merriweather',
  'Verdana': 'Open Sans',
  'Tahoma': 'Open Sans',
  'Trebuchet MS': 'Fira Sans',
  'Impact': 'Anton',
  'Comic Sans MS': 'Comic Neue',
  'Courier New': 'Fira Code',
  'Calibri': 'Open Sans',
  'Cambria': 'Merriweather',
  'Candara': 'Nunito',
  'Garamond': 'EB Garamond',
  'Baskerville': 'Libre Baskerville',
  'Bodoni': 'Bodoni Moda',
  'Didot': 'Bodoni Moda',
  'Franklin Gothic': 'Oswald',
  'Microsoft Sans Serif': 'Roboto',
  'Monotype Corsiva': 'Dancing Script',
  'Sylfaen': 'Noto Serif',
  'Ubuntu': 'Roboto',
  'DejaVu Sans': 'Noto Sans',
  'Carlito': 'Open Sans',
};

/**
 * Извлекает базовое имя шрифта из CSS font-family строки
 */
function extractFontName(fontFamily: string): string {
  const first = fontFamily.split(',')[0].trim();
  return first.replace(/['"]/g, '');
}

/**
 * Получает URL шрифта из Google Fonts CSS API
 */
async function getGoogleFontUrl(
  fontName: string,
  weight: string,
  style: string
): Promise<string | null> {
  try {
    const weightNum = weight === 'bold' ? '700' : '400';
    const encodedName = encodeURIComponent(fontName);
    
    // CSS2 API для современных браузеров
    let cssUrl: string;
    if (style === 'italic') {
      cssUrl = `https://fonts.googleapis.com/css2?family=${encodedName}:ital,wght@1,${weightNum}&display=swap`;
    } else {
      cssUrl = `https://fonts.googleapis.com/css2?family=${encodedName}:wght@${weightNum}&display=swap`;
    }

    const response = await fetch(cssUrl);
    if (!response.ok) {
      console.warn(`Google Fonts CSS request failed for ${fontName}: ${response.status}`);
      return null;
    }
    
    const css = await response.text();
    
    // Ищем URL в CSS - fontkit поддерживает все форматы
    const urlMatch = css.match(/url\(([^)]+)\)/);
    if (urlMatch) {
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
    const fallback = SYSTEM_FONT_FALLBACKS[fontName];
    if (fallback) {
      console.log(`Font "${fontName}" is system font, using fallback: ${fallback}`);
      targetFont = fallback;
    } else {
      console.log(`Font "${fontName}" not found, using Roboto as fallback`);
      targetFont = 'Roboto';
    }
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
      
      // fontkit.create принимает Buffer или Uint8Array
      const fontResult = fontkit.create(buffer as any);
      
      // Если это коллекция шрифтов, берём первый
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
 * Конвертирует path из fontkit в SVG path string
 */
function pathToSvgString(path: any): string {
  let pathData = '';
  
  // fontkit path имеет метод toSVG()
  if (path && typeof path.toSVG === 'function') {
    return path.toSVG();
  }
  
  // Fallback - ручная конвертация команд
  if (path && path.commands) {
    for (const cmd of path.commands) {
      switch (cmd.command) {
        case 'moveTo':
          pathData += `M ${cmd.args[0]} ${cmd.args[1]} `;
          break;
        case 'lineTo':
          pathData += `L ${cmd.args[0]} ${cmd.args[1]} `;
          break;
        case 'curveTo':
        case 'bezierCurveTo':
          pathData += `C ${cmd.args[0]} ${cmd.args[1]} ${cmd.args[2]} ${cmd.args[3]} ${cmd.args[4]} ${cmd.args[5]} `;
          break;
        case 'quadraticCurveTo':
          pathData += `Q ${cmd.args[0]} ${cmd.args[1]} ${cmd.args[2]} ${cmd.args[3]} `;
          break;
        case 'closePath':
          pathData += 'Z ';
          break;
      }
    }
  }
  
  return pathData;
}

/**
 * Получает path глифа с учётом размера шрифта
 */
function getGlyphPath(font: fontkit.Font, char: string, fontSize: number): { path: string; advance: number } {
  const glyph = font.glyphForCodePoint(char.codePointAt(0) || 0);
  
  // Масштаб: fontSize / unitsPerEm
  const scale = fontSize / font.unitsPerEm;
  
  // Получаем advance width
  const advance = (glyph.advanceWidth || 0) * scale;
  
  // Получаем path глифа
  const glyphPath = glyph.path;
  let pathString = pathToSvgString(glyphPath);
  
  // Применяем масштаб к path
  if (pathString) {
    pathString = svgpath(pathString)
      .scale(scale, -scale) // Инвертируем Y для SVG координат
      .toString();
  }
  
  return { path: pathString, advance };
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
    
    // Собираем все глифы
    const paths: string[] = [];
    let currentX = 0;
    
    for (const char of text) {
      if (char === ' ') {
        const spaceGlyph = font.glyphForCodePoint(32);
        const scale = fontSize / font.unitsPerEm;
        currentX += (spaceGlyph.advanceWidth || fontSize * 0.3) * scale;
        continue;
      }
      
      const { path, advance } = getGlyphPath(font, char, fontSize);
      
      if (path) {
        const transformedPath = svgpath(path)
          .translate(currentX, 0)
          .toString();
        paths.push(transformedPath);
      }
      
      currentX += advance;
    }
    
    // Объединяем все пути
    const combinedPath = paths.join(' ');
    
    // Вычисляем центр для позиционирования
    // Парсим bbox из пути (упрощённо - используем currentX как ширину)
    const totalWidth = currentX;
    const height = fontSize;
    
    // Центрируем по x и y
    const finalPath = svgpath(combinedPath)
      .translate(-totalWidth / 2, height * 0.35) // 0.35 - примерная базовая линия
      .translate(x, y)
      .toString();

    return `<path d="${finalPath}" fill="${color}"/>`;
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
    let totalWidth = 0;
    const charData: Array<{
      char: string;
      advance: number;
      isSpace: boolean;
      path?: string;
    }> = [];

    for (const char of text) {
      if (char === ' ') {
        const spaceGlyph = font.glyphForCodePoint(32);
        const advance = (spaceGlyph.advanceWidth || fontSize * 0.3) * scale;
        charData.push({ char, advance, isSpace: true });
        totalWidth += advance;
      } else {
        const { path, advance } = getGlyphPath(font, char, fontSize);
        charData.push({ char, advance, isSpace: false, path });
        totalWidth += advance;
      }
    }

    // Проверяем, не превышает ли текст длину окружности
    const circumference = 2 * Math.PI * radius;
    let actualFontSize = fontSize;
    
    if (totalWidth > circumference * 0.9) {
      const scaleFactor = (circumference * 0.9) / totalWidth;
      actualFontSize = fontSize * scaleFactor;
      
      // Пересчитываем с новым размером
      totalWidth = 0;
      charData.length = 0;
      const newScale = actualFontSize / font.unitsPerEm;

      for (const char of text) {
        if (char === ' ') {
          const spaceGlyph = font.glyphForCodePoint(32);
          const advance = (spaceGlyph.advanceWidth || actualFontSize * 0.3) * newScale;
          charData.push({ char, advance, isSpace: true });
          totalWidth += advance;
        } else {
          const { path, advance } = getGlyphPath(font, char, actualFontSize);
          charData.push({ char, advance, isSpace: false, path });
          totalWidth += advance;
        }
      }
    }

    // Рассчитываем начальный угол
    const textArcAngle = totalWidth / radius;
    const startAngleRad = (startAngle * Math.PI) / 180;

    let currentAngle;
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

      const { advance, path } = data;

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

      const charX = cx + Math.cos(currentAngle) * radius;
      const charY = cy + Math.sin(currentAngle) * radius;

      // Угол поворота
      let rotationRad = currentAngle + Math.PI / 2;
      if (isFlipped) {
        rotationRad -= Math.PI;
      }
      const rotationDeg = (rotationRad * 180) / Math.PI;

      // Центрируем глиф (примерно)
      const glyphCenterX = advance / 2;
      const glyphCenterY = actualFontSize * 0.35;

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

    return paths.join('\n');
  } catch (error) {
    console.error('Error converting curved text to path:', error);
    
    // Fallback
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