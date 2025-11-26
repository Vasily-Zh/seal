import opentype from 'opentype.js';
import svgpath from 'svgpath';

/**
 * Кэш загруженных шрифтов
 */
const fontCache = new Map<string, opentype.Font>();

/**
 * Кэш URL шрифтов (чтобы не запрашивать CSS каждый раз)
 */
const fontUrlCache = new Map<string, string>();

/**
 * Маппинг системных шрифтов на Google Fonts эквиваленты
 */
const systemToGoogleFont: Record<string, string> = {
  'Arial': 'Arimo',
  'Georgia': 'Tinos',
  'Times New Roman': 'Tinos',
  'Verdana': 'Open Sans',
  'Courier New': 'Cousine',
  'Impact': 'Oswald',
  'Tahoma': 'Open Sans',
  'Helvetica': 'Open Sans',
};

/**
 * Получает URL TTF файла шрифта через Google Fonts CSS API
 */
async function getFontUrl(fontFamily: string, fontWeight: string = 'normal'): Promise<string> {
  // Преобразуем системные шрифты в Google Fonts эквиваленты
  const googleFontName = systemToGoogleFont[fontFamily] || fontFamily;
  
  const weight = fontWeight === 'bold' ? '700' : '400';
  const cacheKey = `${googleFontName}-${weight}`;
  
  if (fontUrlCache.has(cacheKey)) {
    return fontUrlCache.get(cacheKey)!;
  }
  
  try {
    // Формируем URL для Google Fonts CSS API
    const encodedFamily = encodeURIComponent(googleFontName).replace(/%20/g, '+');
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weight}&display=swap`;
    
    // Запрашиваем CSS с User-Agent который вернет TTF
    const response = await fetch(cssUrl, {
      headers: {
        // Этот User-Agent заставляет Google вернуть TTF вместо WOFF2
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:60.0) Gecko/20100101 Firefox/60.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch font CSS: ${response.status}`);
    }
    
    const css = await response.text();
    
    // Извлекаем URL TTF файла из CSS
    // Ищем url(...) внутри @font-face
    const urlMatch = css.match(/url\(([^)]+\.ttf)\)/);
    
    if (urlMatch && urlMatch[1]) {
      const ttfUrl = urlMatch[1].replace(/['"]/g, '');
      fontUrlCache.set(cacheKey, ttfUrl);
      return ttfUrl;
    }
    
    // Если TTF не найден, пробуем WOFF2 (opentype.js может его читать)
    const woff2Match = css.match(/url\(([^)]+\.woff2)\)/);
    if (woff2Match && woff2Match[1]) {
      const woff2Url = woff2Match[1].replace(/['"]/g, '');
      fontUrlCache.set(cacheKey, woff2Url);
      return woff2Url;
    }
    
    throw new Error('No font URL found in CSS');
  } catch (error) {
    console.warn(`Failed to get font URL for ${googleFontName}:`, error);
    throw error;
  }
}

/**
 * Загружает шрифт из Google Fonts
 */
async function loadFont(fontFamily: string, fontWeight: string, fontStyle: string): Promise<opentype.Font> {
  const cacheKey = `${fontFamily}-${fontWeight}-${fontStyle}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  // Список шрифтов для попытки загрузки (основной + fallback)
  const fontsToTry = [fontFamily];
  
  // Добавляем Roboto как fallback
  if (fontFamily !== 'Roboto') {
    fontsToTry.push('Roboto');
  }
  
  // Добавляем Open Sans как последний fallback
  if (fontFamily !== 'Open Sans') {
    fontsToTry.push('Open Sans');
  }

  let lastError: Error | null = null;

  for (const font of fontsToTry) {
    try {
      const fontUrl = await getFontUrl(font, fontWeight);
      
      const response = await fetch(fontUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch font from ${fontUrl}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const parsedFont = opentype.parse(arrayBuffer);

      // Кэшируем под оригинальным именем
      fontCache.set(cacheKey, parsedFont);
      
      if (font !== fontFamily) {
        console.debug(`Font "${fontFamily}" not available, using "${font}" as fallback`);
      }
      
      return parsedFont;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Продолжаем к следующему шрифту
    }
  }

  throw new Error(`Failed to load any font. Last error: ${lastError?.message}`);
}

/**
 * Конвертирует текст в SVG path используя настоящие векторные глифы из шрифта
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

    // Создаем путь для текста
    const path = font.getPath(text, 0, 0, fontSize);

    // Формируем строку пути из команд
    let pathData = '';
    path.commands.forEach((cmd: any) => {
      if (cmd.type === 'M') {
        pathData += `M ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'L') {
        pathData += `L ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'C') {
        pathData += `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'Q') {
        pathData += `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y} `;
      } else if (cmd.type === 'Z' || cmd.type === 'z') {
        pathData += 'Z ';
      }
    });

    // Вычисляем bounding box текста
    const bbox = path.getBoundingBox();
    const bboxCenterX = (bbox.x1 + bbox.x2) / 2;
    const bboxCenterY = (bbox.y1 + bbox.y2) / 2;

    // Применяем трансформацию через svgpath
    const transformedPath = svgpath(pathData)
      .translate(-bboxCenterX, -bboxCenterY)
      .translate(x, y)
      .toString();

    return `<path d="${transformedPath}" fill="${color}"/>`;
  } catch (error) {
    console.error('Error converting text to path:', error);
    // Fallback на обычный text
    return `<text x="${x}" y="${y}" fill="${color}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" font-style="${fontStyle}" text-anchor="middle" dominant-baseline="middle">${text}</text>`;
  }
}

/**
 * Конвертирует круговой текст в paths используя настоящие векторные глифы
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

    // Рассчитываем общую ширину текста
    let totalWidth = 0;
    const charData = [];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];

      // Получаем ширину глифа
      const advance = font.getAdvanceWidth(char, fontSize);

      if (char === ' ') {
        charData.push({ char, advance, isSpace: true });
        totalWidth += advance;
      } else {
        const glyphPath = font.getPath(char, 0, 0, fontSize);
        charData.push({
          char,
          advance,
          isSpace: false,
          glyphPath
        });
        totalWidth += advance;
      }
    }

    // Проверяем, не превышает ли текст длину окружности
    const circumference = 2 * Math.PI * radius;
    if (totalWidth > circumference * 0.9) { // 90% окружности для безопасности
      // Уменьшаем размер шрифта пропорционально
      const scale = (circumference * 0.9) / totalWidth;
      fontSize = fontSize * scale;

      // Пересчитываем данные с новым размером шрифта
      totalWidth = 0;
      charData.length = 0;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const advance = font.getAdvanceWidth(char, fontSize);

        if (char === ' ') {
          charData.push({ char, advance, isSpace: true });
          totalWidth += advance;
        } else {
          const glyphPath = font.getPath(char, 0, 0, fontSize);
          charData.push({
            char,
            advance,
            isSpace: false,
            glyphPath
          });
          totalWidth += advance;
        }
      }
    }

    // Рассчитываем начальный угол для центрирования текста
    // Длина дуги = угол (в радианах) * радиус
    const textArcLength = totalWidth;
    const textArcAngle = textArcLength / radius; // в радианах
    const startAngleRad = (startAngle * Math.PI) / 180;

    // Центрируем текст относительно startAngle
    // startAngle: 90° = низ круга, 270° = верх круга (в системе координат SVG)
    // Для flipped текста меняется направление движения по кругу
    let currentAngle;
    if (isFlipped) {
      // Для flipped=true: начинаем справа от центра, идем против часовой
      currentAngle = startAngleRad + textArcAngle / 2;
    } else {
      // Для flipped=false: начинаем слева от центра, идем по часовой
      currentAngle = startAngleRad - textArcAngle / 2;
    }

    // Для каждой буквы создаем отдельный path
    for (let i = 0; i < charData.length; i++) {
      const data = charData[i];

      if (data.isSpace) {
        // Для пробела перемещаемся на расстояние advance
        if (isFlipped) {
          currentAngle -= data.advance / radius; // против часовой
        } else {
          currentAngle += data.advance / radius; // по часовой
        }
        continue;
      }

      const { advance, glyphPath } = data;

      // Формируем строку пути из команд
      let pathData = '';
      glyphPath.commands.forEach((cmd: any) => {
        if (cmd.type === 'M') {
          pathData += `M ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'L') {
          pathData += `L ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'C') {
          pathData += `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'Q') {
          pathData += `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y} `;
        } else if (cmd.type === 'Z' || cmd.type === 'z') {
          pathData += 'Z ';
        }
      });

      if (!pathData || pathData === '') {
        // Для пустого пути перемещаемся на расстояние advance
        if (isFlipped) {
          currentAngle -= advance / radius; // против часовой
        } else {
          currentAngle += advance / radius; // по часовой
        }
        continue;
      }

      // Получаем реальный bounding box глифа для правильного центрирования
      const bbox = glyphPath.getBoundingBox();
      const centerX = (bbox.x1 + bbox.x2) / 2;
      const centerY = (bbox.y1 + bbox.y2) / 2;

      // Сдвигаем угол на половину advance width для позиционирования символа
      if (isFlipped) {
        currentAngle -= (advance / 2) / radius; // против часовой
      } else {
        currentAngle += (advance / 2) / radius; // по часовой
      }

      // Позиция центра глифа на окружности
      const charX = cx + Math.cos(currentAngle) * radius;
      const charY = cy + Math.sin(currentAngle) * radius;

      // Угол поворота глифа:
      // - для обычного текста (flipped=false): буквы читаемые, поворот на 90° (перпендикулярно радиусу) + 180° для читаемости
      // - для перевернутого текста (flipped=true): буквы "вверх ногами", только 90° поворот
      let rotationRad = currentAngle + Math.PI / 2; // базовый поворот (касательная + 180°)

      // Для перевернутого текста УБИРАЕМ дополнительный поворот на 180 градусов
      if (isFlipped) {
        rotationRad -= Math.PI; // Убираем 180 градусов - текст будет "вверх ногами"
      }

      const rotationDeg = (rotationRad * 180) / Math.PI;

      // Применяем трансформацию
      const transformedPath = svgpath(pathData)
        .translate(-centerX, -centerY)
        .rotate(rotationDeg, 0, 0)
        .translate(charX, charY)
        .toString();

      paths.push(`<path d="${transformedPath}" fill="${color}"/>`);

      // Сдвигаем угол на вторую половину advance width
      if (isFlipped) {
        currentAngle -= (advance / 2) / radius; // против часовой
      } else {
        currentAngle += (advance / 2) / radius; // по часовой
      }
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