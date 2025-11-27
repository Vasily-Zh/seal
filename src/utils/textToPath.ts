import opentype from 'opentype.js';
import svgpath from 'svgpath';

/**
 * Кэш загруженных шрифтов
 */
const fontCache = new Map<string, opentype.Font>();

/**
 * Загружает шрифт из Google Fonts
 */
async function loadFont(fontFamily: string, fontWeight: string, fontStyle: string): Promise<opentype.Font> {
  // Извлекаем первое название шрифта из строки (убираем fallback'и)
  const primaryFontFamily = fontFamily.split(',')[0].trim();
  const cacheKey = `${primaryFontFamily}-${fontWeight}-${fontStyle}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  try {
    // Системные шрифты (используем fallback на Roboto)
    const systemFonts = ['Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS'];
    
    // Проверяем, является ли шрифт системным
    if (systemFonts.some(sysFont => primaryFontFamily.includes(sysFont))) {
      // Для системных шрифтов используем Roboto как похожий fallback
      const fallbackFont = await loadGoogleFont('Roboto', fontWeight, fontStyle);
      fontCache.set(cacheKey, fallbackFont);
      return fallbackFont;
    }

    // Загружаем шрифт из Google Fonts
    const font = await loadGoogleFont(primaryFontFamily, fontWeight, fontStyle);
    fontCache.set(cacheKey, font);
    return font;
  } catch (error) {
    console.error('Font loading failed:', error);
    // Fallback на Roboto
    try {
      const fallbackFont = await loadGoogleFont('Roboto', fontWeight, fontStyle);
      fontCache.set(cacheKey, fallbackFont);
      return fallbackFont;
    } catch (fallbackError) {
      console.error('Fallback font loading failed:', fallbackError);
      throw new Error(`Failed to load font: ${fontFamily}`);
    }
  }
}

/**
 * Загружает шрифт из Google Fonts API
 */
async function loadGoogleFont(fontFamily: string, fontWeight: string, fontStyle: string): Promise<opentype.Font> {
  const weightStyle = `${fontWeight}-${fontStyle}`;
  
  // Генерируем Google Fonts URL
  const googleFontsUrl = generateGoogleFontUrl(fontFamily, fontWeight, fontStyle);
  
  const response = await fetch(googleFontsUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return opentype.parse(arrayBuffer);
}

/**
 * Генерирует URL для Google Fonts
 */
function generateGoogleFontUrl(fontFamily: string, fontWeight: string, fontStyle: string): string {
  // Мапинг шрифтов на Google Fonts family names
  const fontFamilyMap: Record<string, string> = {
    'Roboto': 'Roboto',
    'Open Sans': 'Open+Sans',
    'Inter': 'Inter',
    'Alex Brush': 'Alex+Brush',
    'Anton': 'Anton',
    'Archivo': 'Archivo',
    'Baloo 2': 'Baloo+2',
    'Bebas Neue': 'Bebas+Neue',
    'Bodoni Moda': 'Bodoni+Moda',
    'Caveat': 'Caveat',
    'Commissioner': 'Commissioner',
    'Comic Neue': 'Comic+Neue',
    'Cormorant Garamond': 'Cormorant+Garamond',
    'Crimson Pro': 'Crimson+Pro',
    'Dancing Script': 'Dancing+Script',
    'EB Garamond': 'EB+Garamond',
    'Fira Code': 'Fira+Code',
    'Fira Sans': 'Fira+Sans',
    'Fredoka': 'Fredoka',
    'Great Vibes': 'Great+Vibes',
    'IBM Plex Sans': 'IBM+Plex+Sans',
    'IBM Plex Serif': 'IBM+Plex+Serif',
    'Karla': 'Karla',
    'Kaushan Script': 'Kaushan+Script',
    'League Gothic': 'League+Gothic',
    'Libre Baskerville': 'Libre+Baskerville',
    'Literata': 'Literata',
    'Manrope': 'Manrope',
    'Merriweather': 'Merriweather',
    'Mulish': 'Mulish',
    'Noto Sans': 'Noto+Sans',
    'Noto Serif': 'Noto+Serif',
    'Nunito': 'Nunito',
    'Oswald': 'Oswald',
    'Parisienne': 'Parisienne',
    'Playfair Display': 'Playfair+Display',
    'Poppins': 'Poppins',
    'PT Sans': 'PT+Sans',
    'PT Serif': 'PT+Serif',
    'Public Sans': 'Public+Sans',
    'Sacramento': 'Sacramento',
    'Satisfy': 'Satisfy',
    'Source Serif 4': 'Source+Serif+4',
    'Tangerine': 'Tangerine',
  };

  const googleFamilyName = fontFamilyMap[fontFamily] || 'Roboto';
  
  // Определяем начертания
  const weights = ['400', '700'];
  const hasItalic = fontStyle === 'italic';
  
  let axis = '';
  if (hasItalic) {
    axis = `ital,wght@0,${weights[0]};0,${weights[1]};1,${weights[0]};1,${weights[1]}`;
  } else {
    axis = `wght@${weights[0]};${weights[1]}`;
  }
  
  return `https://fonts.googleapis.com/css2?family=${googleFamilyName}:${axis}&display=swap`;
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
          glyphPath: glyphPath || null
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
            glyphPath: glyphPath || null
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

      const { char, advance, glyphPath } = data;

      // Проверяем, что glyphPath существует
      if (!glyphPath) {
        // Для пустого пути перемещаемся на расстояние advance
        if (isFlipped) {
          currentAngle -= advance / radius; // против часовой
        } else {
          currentAngle += advance / radius; // по часовой
        }
        continue;
      }

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