// Импорты шрифтов для локальной загрузки
import robotoRegularUrl from '../assets/fonts/roboto-regular.ttf';
import robotoBoldUrl from '../assets/fonts/roboto-regular.ttf'; // временно используем regular

// Карта шрифтов с их URL
export const fontUrls: Record<string, Record<string, string>> = {
  'Roboto': {
    'normal-normal': robotoRegularUrl,
    'bold-normal': robotoBoldUrl,
  },
  // Добавим другие шрифты по мере необходимости
};

// Функция для получения URL шрифта
export function getFontUrl(fontFamily: string, fontWeight: string): string | null {
  const weightKey = fontWeight === 'bold' ? 'bold-normal' : 'normal-normal';
  return fontUrls[fontFamily]?.[weightKey] || null;
}