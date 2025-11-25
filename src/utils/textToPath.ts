import opentype from 'opentype.js';
import svgpath from 'svgpath';

/**
 * Кэш загруженных шрифтов
 */
const fontCache = new Map<string, opentype.Font>();

/**
 * URLs для системных шрифтов (используем эквиваленты от Google или других источников)
 */
const systemFontUrls: Record<string, Record<string, string>> = {
  'Arial': { 'normal-normal': 'https://fonts.gstatic.com/s/arimo/v30/P5SfzZ-pYmxS-6hx1TzI7Lq-Hk_e.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/arimo/v30/P5SdzZ-pYmxS-6hx1TzI7Lq-DlC0H9Iy.ttf' },
  'Georgia': { 'normal-normal': 'https://fonts.gstatic.com/s/crimsonpro/v16/wlpvgwz74akmdF-2YdqnjW37oG9X8W1oHAq1AHDw.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/crimsonpro/v16/wlp3gwz74akmdF-2YdqnjW37oG9X8W1oHAq1AHNZPvw.ttf' },
  'Times New Roman': { 'normal-normal': 'https://fonts.gstatic.com/s/notoserif/v21/ga6iaw1J5X0T9RW6j9bKVlk-fUDv-fVtMzLgXf_mFLI.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/notoserif/v21/ga6iaw1J5X0T9RW6j9bKVlk-fUDv_bhj74T0XwfsFJI.ttf' },
  'Verdana': { 'normal-normal': 'https://fonts.gstatic.com/s/notoans/v26/o-0mIpQlx3QUlC5A4PNr5DA_Yggg0VQtEOEJ.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/notosans/v21/o-0bIpQlx3QUlC5A4PNr5DA_aV7jFLZpvjCL-v4.ttf' },
  'Courier New': { 'normal-normal': 'https://fonts.gstatic.com/s/firacode/v22/uU9CPJZE5FC0zXVQUslM_-9SFj-PJ8PzFAKGPxnxVvE.ttf' },
  'Comic Sans MS': { 'normal-normal': 'https://fonts.gstatic.com/s/comicneue/v9/4UaZrEtFpH4LFDXo8Al1t34P5dJ8YWE.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/comicneue/v9/4UaWrEtFpH4LFDXo8Al1t34P5eQQ2YgV.ttf' },
  'Impact': { 'normal-normal': 'https://fonts.gstatic.com/s/leaguegothic/v6/qFdH35WCmmt5eweSuJpVY3gW3n0.ttf' },
  'Tahoma': { 'normal-normal': 'https://fonts.gstatic.com/s/ptsans/v17/jizYREtUiDQIkxj0Y2RjGEFWRdw.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/ptsans/v17/jizfREtUiDQIkxj0Y2RjEE3lEhU.ttf' },
};

/**
 * Известные Google Fonts URLs для получения шрифтов напрямую
 * Используем постоянные ссылки на шрифты от Google Fonts
 */
const googleFontUrls: Record<string, Record<string, string>> = {
  'Alex Brush': { 'normal-normal': 'https://fonts.gstatic.com/s/alexbrush/v24/SZc83IfNMtRHj8cJxDhtHOlfkOdz5wE.ttf' },
  'Anton': { 'normal-normal': 'https://fonts.gstatic.com/s/anton/v20/1Ptgg87LROyAm0CVWQrZV4edvMelDN_Ky7n-JTWp.ttf' },
  'Archivo': { 'normal-normal': 'https://fonts.gstatic.com/s/archivo/v21/k3k702ZOKiLJrEUMS4A7LRJQbMtW_M-OurPrJvP8xbEHqxQUU3M.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/archivo/v21/k3k702ZOKiLJrEUMS4A7LRJQbMtW_M-OurPrJvP8xbEHqxQUU6M.ttf' },
  'Baloo 2': { 'normal-normal': 'https://fonts.gstatic.com/s/baloo2/v24/wXK1E30W1osJwUyqTtR3yC4P5MCk.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/baloo2/v24/wXK-E30W1osJwUyqTtR3yC3f7fhJ2Q.ttf' },
  'Bebas Neue': { 'normal-normal': 'https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gIhQaZWVFBCUBln0inGvE_.ttf' },
  'Bodoni Moda': { 'normal-normal': 'https://fonts.gstatic.com/s/bodonimoda/v20/4UaWrENHsxJlGDuGo1OIW7BIUmZ8Z5A3fVJr1TE.ttf' },
  'Caveat': { 'normal-normal': 'https://fonts.gstatic.com/s/caveat/v22/473ahrMHYa5O7m9mxaLaAqN7yG9e.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/caveat/v22/473QhrMHYa5O7m9mxaLaAqN5dHdhAg.ttf' },
  'Commissioner': { 'normal-normal': 'https://fonts.gstatic.com/s/commissioner/v21/r4kxrLJyydQ4bhzVm1sQ2T5L7g32mEIJLPD3AKOqo-GcZ4WVqG0.ttf' },
  'Comic Neue': { 'normal-normal': 'https://fonts.gstatic.com/s/comicneue/v9/4UaZrEtFpH4LFDXo8Al1t34P5dJ8YWE.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/comicneue/v9/4UaWrEtFpH4LFDXo8Al1t34P5eQQ2YgV.ttf' },
  'Cormorant Garamond': { 'normal-normal': 'https://fonts.gstatic.com/s/cormorantgaramond/v11/co3YmX5slCNuVQc8V7m-xLB55uWKcdCnDHmWPIr0.ttf' },
  'Crimson Pro': { 'normal-normal': 'https://fonts.gstatic.com/s/crimsonpro/v16/wlpvgwz74akmdF-2YdqnjW37oG9X8W1oHAq1AHDw.ttf' },
  'Dancing Script': { 'normal-normal': 'https://fonts.gstatic.com/s/dancingscript/v17/If2pR6TJj3GH850Ty5DRveWN4xzF3p.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/dancingscript/v17/If2tR6TJj3GH850Ty5DRzGqZR-XBRYvbZg.ttf' },
  'EB Garamond': { 'normal-normal': 'https://fonts.gstatic.com/s/ebgaramond/v28/ga6iaw1J5X0T9RW6j9bKVlk-cU03qzH0Z5dUdYuN7OFr.ttf' },
  'Fira Code': { 'normal-normal': 'https://fonts.gstatic.com/s/firacode/v22/uU9CPJZE5FC0zXVQUslM_-9SFj-PJ8PzFAKGPxnxVvE.ttf' },
  'Fira Sans': { 'normal-normal': 'https://fonts.gstatic.com/s/firasans/v11/va9E4kDNxMZdL-6FOSo-2m0GRsz6d_3TBrQAQdHPVFZjwg.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/firasans/v11/va9E4kDNxMZdL-6FOSo-2m0GRsz6d_3TBrQAQdHPN1BjwgNq.ttf' },
  'Fredoka': { 'normal-normal': 'https://fonts.gstatic.com/s/fredoka/v17/k3k702ZOKiLJrEUMS4A7LRJYb3qXYBb4roPdzHbI.ttf' },
  'Great Vibes': { 'normal-normal': 'https://fonts.gstatic.com/s/greatvibes/v22/gok-H7xwcPzw7K0A_HupCIFs.ttf' },
  'IBM Plex Sans': { 'normal-normal': 'https://fonts.gstatic.com/s/ibmplexsans/v20/zYXgKVr_E4xch6A3Y5LJXo93RA9d.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/ibmplexsans/v20/zYX9KVr_E4xch6A3Y5LJXm4aOjKUDTxXgzZKM-Tq.ttf' },
  'IBM Plex Serif': { 'normal-normal': 'https://fonts.gstatic.com/s/ibmplexserif/v20/jizGREVNn1dOx-zrZ2X3pZvkTi3N4HIdrMg.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/ibmplexserif/v20/jizAREVNn1dOx-zrZ2X3pZvkTi0N0mZB6NgL0Q.ttf' },
  'Inter': { 'normal-normal': 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.ttf' },
  'Karla': { 'normal-normal': 'https://fonts.gstatic.com/s/karla/v31/qkBWXvsO6M3qgeIBoDlMsx5aVOPgTQLTr7PU4qNP.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/karla/v31/qkBSXvsO6M3qgeIBoDlMsx5aVOPgy_RVt7NWrD0.ttf' },
  'Kaushan Script': { 'normal-normal': 'https://fonts.gstatic.com/s/kaushanscript/v16/OZpEg_ltAWEr2cbYe0-_xMHT3wU.ttf' },
  'League Gothic': { 'normal-normal': 'https://fonts.gstatic.com/s/leaguegothic/v6/qFdH35WCmmt5eweSuJpVY3gW3n0.ttf' },
  'Libre Baskerville': { 'normal-normal': 'https://fonts.gstatic.com/s/librebaskerville/v17/kJEjBvqX7dAtaw1Z6hsCIdUYFqTAjF1nCGGDVF4-b9s.ttf' },
  'Literata': { 'normal-normal': 'https://fonts.gstatic.com/s/literata/v42/buEspuHjgIloVQdaVMcxWZkc9ItVbDNNbfCMYG5rAQGcf3v2.ttf' },
  'Manrope': { 'normal-normal': 'https://fonts.gstatic.com/s/manrope/v14/xn7gD6nlqKc5NUf_rXW8uKBWCsFAZzHnz0UQD.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/manrope/v14/xn7iD6nlqKc5NUf_rXW8uKBWCsFAQahk3EcDD_Y.ttf' },
  'Merriweather': { 'normal-normal': 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-eISZ6ZVDgwHrFWf9RfE.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/merriweather/v30/u-460qyriQwlOrhSvowK_l521gwi8AxGX_8aFS3r_Fo.ttf' },
  'Mulish': { 'normal-normal': 'https://fonts.gstatic.com/s/mulish/v13/c4md4jHE-CJo0tDM4ChEAuBCCsFAZzHnz0UQD.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/mulish/v13/c4mf4jHE-CJo0tDM4ChEAuBCCsFAQahk3EcDD_Y.ttf' },
  'Noto Sans': { 'normal-normal': 'https://fonts.gstatic.com/s/notosans/v21/o-0mIpQlx3QUlC5A4PNr5DA_Yggg0VQtEOEJ.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/notosans/v21/o-0bIpQlx3QUlC5A4PNr5DA_aV7jFLZpvjCL-v4.ttf' },
  'Noto Serif': { 'normal-normal': 'https://fonts.gstatic.com/s/notoserif/v21/ga6iaw1J5X0T9RW6j9bKVlk-fUDv-fVtMzLgXf_mFLI.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/notoserif/v21/ga6jaw1J5X0T9RW6j9bKVlk-fUDv_bhj74T0XwfsFJI.ttf' },
  'Nunito': { 'normal-normal': 'https://fonts.gstatic.com/s/nunito/v26/XRXV3I6Li01BKofINeaB_5VzZzStUHkkbJtAd-bxAg.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/nunito/v26/XRXW3I6Li01BKofINeaB_6VpZaRAUd0m2x1KJ5dkAggv8Q.ttf' },
  'Open Sans': { 'normal-normal': 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4nY1M2xLER.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/opensans/v34/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4nY1M2xLER.ttf' },
  'Oswald': { 'normal-normal': 'https://fonts.gstatic.com/s/oswald/v54/TK3iWkUHHAIjg752DT8-WIFjXHUFJNsbWvn0r1wLVkU.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/oswald/v54/TK3iWkUHHAIjg752DT8-WIFjXHUF7ORXf_yS3F5RMG0.ttf' },
  'Parisienne': { 'normal-normal': 'https://fonts.gstatic.com/s/parisienne/v14/E21i_d1Hpmg5M9VzIGQPP-4.ttf' },
  'Playfair Display': { 'normal-normal': 'https://fonts.gstatic.com/s/playfairdisplay/v31/nuFvD-vgS5LKvZrNeySMLFKPW6lo8jdHKfVVLdOxVkw.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/playfairdisplay/v31/nuFvD-vgS5LKvZrNeySMLFKPW6lo8jdHKfVVIe1-D_w.ttf' },
  'Poppins': { 'normal-normal': 'https://fonts.gstatic.com/s/poppins/v20/pxiGypp5QBcF6DBJMtw6iKI.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/poppins/v20/pxiGiop3Ql6BLRF1M05FS6BZf4I.ttf' },
  'PT Sans': { 'normal-normal': 'https://fonts.gstatic.com/s/ptsans/v17/jizYREtUiDQIkxj0Y2RjGEFWRdw.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/ptsans/v17/jizfREtUiDQIkxj0Y2RjEE3lEhU.ttf' },
  'PT Serif': { 'normal-normal': 'https://fonts.gstatic.com/s/ptserif/v17/ga6iaw1J5X0T9RW6j9bKVlk-e_2dWJXrYfCTyFJ7.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/ptserif/v17/ga6iaw1J5X0T9RW6j9bKVlk-e_2d5sXnYfCTyFJ7.ttf' },
  'Public Sans': { 'normal-normal': 'https://fonts.gstatic.com/s/publicsans/v15/HI_diYsKILxRpQaDDfHyB53I6lz46C3wIqKHJ4l6zcg.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/publicsans/v15/HI_ciYsKILxRpQaDDfHyB53I6sNIqKHJ4l6zcuohWfCN.ttf' },
  'Roboto': { 'normal-normal': 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf' },
  'Sacramento': { 'normal-normal': 'https://fonts.gstatic.com/s/sacramento/v13/buEzpo6gcdhsMq7DHkjR4pAZa_J9.ttf' },
  'Satisfy': { 'normal-normal': 'https://fonts.gstatic.com/s/satisfy/v15/rFirNHYz-N4dohgKA4sLw3p3v4aF.ttf' },
  'Source Serif 4': { 'normal-normal': 'https://fonts.gstatic.com/s/sourceserif4/v15/jizBREFyuQ-nE-Z1g-p0r0o0Nzftz0E.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/sourceserif4/v15/jizCREFyuQ-nE-Z1g-p0r0o0N89XtkxHd34.ttf' },
  'Tangerine': { 'normal-normal': 'https://fonts.gstatic.com/s/tangerine/v18/IurY6YF4yw9NP2HvFZluCKN90NYs.ttf' },
  'Ubuntu': { 'normal-normal': 'https://fonts.gstatic.com/s/ubuntu/v20/4iCpES-bOA8FYYnPKd3dBQ.ttf', 'bold-normal': 'https://fonts.gstatic.com/s/ubuntu/v20/4iC9ES-bOA8FYYnPKd3d-0UZbr1b.ttf' },
};

/**
 * Загружает шрифт из Google Fonts или эквивалентов
 */
async function loadFont(fontFamily: string, fontWeight: string, fontStyle: string): Promise<opentype.Font> {
  const cacheKey = `${fontFamily}-${fontWeight}-${fontStyle}`;

  if (fontCache.has(cacheKey)) {
    return fontCache.get(cacheKey)!;
  }

  try {
    // Получаем URL для этого шрифта
    const weightKey = fontWeight === 'bold' ? 'bold-normal' : 'normal-normal';

    // Сначала проверяем системные шрифты
    let fontUrl = systemFontUrls[fontFamily]?.[weightKey];

    if (!fontUrl) {
      // Если это не системный шрифт, ищем в Google Fonts
      fontUrl = googleFontUrls[fontFamily]?.[weightKey];
    }

    if (!fontUrl) {
      // Если нет точного совпадения, пробуем найти normal-normal вариант
      fontUrl = systemFontUrls[fontFamily]?.['normal-normal'] || googleFontUrls[fontFamily]?.['normal-normal'];
    }

    if (!fontUrl) {
      console.warn(`No URL found for font "${fontFamily}", falling back to Roboto`);
      fontUrl = googleFontUrls['Roboto']['normal-normal'];
    }

    const response = await fetch(fontUrl);
    const arrayBuffer = await response.arrayBuffer();
    const font = opentype.parse(arrayBuffer);

    fontCache.set(cacheKey, font);
    return font;
  } catch (error) {
    console.error(`Font loading failed for ${fontFamily}:`, error);
    // Fallback на Roboto
    try {
      const response = await fetch(googleFontUrls['Roboto']['normal-normal']);
      const arrayBuffer = await response.arrayBuffer();
      const font = opentype.parse(arrayBuffer);
      fontCache.set(`${fontFamily}-${fontWeight}-${fontStyle}`, font);
      return font;
    } catch (fallbackError) {
      console.error('Fallback font loading also failed:', fallbackError);
      throw new Error(`Failed to load font: ${fontFamily}`);
    }
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