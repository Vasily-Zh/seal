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
  const cacheKey = `${fontFamily}-${fontWeight}-${fontStyle}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  try {
    // Мапинг шрифтов на Google Fonts URLs
    const fontUrls: Record<string, Record<string, string>> = {
      'Roboto': {
        'normal-normal': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
        'bold-normal': 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
        'normal-italic': 'https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf',
        'bold-italic': 'https://fonts.gstatic.com/s/roboto/v30/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf',
      },
      'Open Sans': {
        'normal-normal': 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf',
        'bold-normal': 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4nY1M2xLER.ttf',
      },
      'Inter': {
        'normal-normal': 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf',
        'bold-normal': 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.ttf',
      },
      'Arial': {
        // Arial не доступен напрямую в Google Fonts, используем fallback
        'normal-normal': 'https://fonts.gstatic.com/s/arial/v21/AMJLvwbL6qy8KqI46Y6RXqLl13aU.woff2',
      },
      'Times New Roman': {
        // Times New Roman не доступен напрямую в Google Fonts, используем fallback
        'normal-normal': 'https://fonts.gstatic.com/s/times/v27/0Xx-4I0ngrVpRwPgY-GJpKqp.woff2',
      },
    };

    const weightStyle = `${fontWeight}-${fontStyle}`;
    const fontUrl = fontUrls[fontFamily]?.[weightStyle] || fontUrls['Roboto']['normal-normal'];

    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    const font = opentype.parse(arrayBuffer);

    fontCache.set(cacheKey, font);
    return font;
  } catch (error) {
    console.error('Font loading failed:', error);
    // Fallback - создаём простой font (заглушка)
    throw new Error(`Failed to load font: ${fontFamily}`);
  }
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

    // Центрируем текст относительно startAngle, при этом направление размещения
    // символов остается постоянным (по часовой стрелке), изменяется только поворот самих глифов
    // startAngle: 90° = низ круга, 270° = верх круга (в системе координат SVG)
    let currentAngle = startAngleRad - textArcAngle / 2;

    // Для каждой буквы создаем отдельный path
    for (let i = 0; i < charData.length; i++) {
      const data = charData[i];

      if (data.isSpace) {
        // Для пробела перемещаемся на расстояние advance в обычном направлении
        currentAngle += data.advance / radius;
        continue;
      }

      const { char, advance, glyphPath } = data;

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
        currentAngle += advance / radius;
        continue;
      }

      // Получаем реальный bounding box глифа для правильного центрирования
      const bbox = glyphPath.getBoundingBox();
      const centerX = (bbox.x1 + bbox.x2) / 2;
      const centerY = (bbox.y1 + bbox.y2) / 2;

      // Сдвигаем угол на половину advance width для позиционирования символа
      currentAngle += (advance / 2) / radius;

      // Позиция центра глифа на окружности
      const charX = cx + Math.cos(currentAngle) * radius;
      const charY = cy + Math.sin(currentAngle) * radius;

      // Угол поворота глифа:
      // - для обычного текста: касательная к окружности (перпендикулярно радиусу)
      // - для перевернутого текста: дополнительный поворот на 180 градусов
      let rotationRad = currentAngle - Math.PI / 2;

      // Для перевернутого текста применяем дополнительный поворот на 180 градусов
      if (isFlipped) {
        rotationRad += Math.PI; // Добавляем 180 градусов для "переворота" текста
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
      currentAngle += (advance / 2) / radius;
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