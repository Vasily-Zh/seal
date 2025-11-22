// Скрипт для генерации полной базы иконок с русскими переводами
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Словарь базовых переводов для консистентности
const translations = {
  // Действия
  'add': 'добавить',
  'remove': 'удалить',
  'delete': 'удалить',
  'edit': 'редактировать',
  'copy': 'копировать',
  'paste': 'вставить',
  'cut': 'вырезать',
  'save': 'сохранить',
  'download': 'скачать',
  'upload': 'загрузить',
  'search': 'поиск',
  'filter': 'фильтр',
  'sort': 'сортировка',
  'close': 'закрыть',
  'open': 'открыть',
  'play': 'играть',
  'pause': 'пауза',
  'stop': 'стоп',
  'send': 'отправить',
  'share': 'поделиться',
  'check': 'галочка',
  'lock': 'замок',
  'unlock': 'разблокировать',
  'zoom': 'масштаб',
  'move': 'переместить',
  'rotate': 'вращать',
  'flip': 'перевернуть',

  // Объекты и фигуры
  'circle': 'круг',
  'square': 'квадрат',
  'triangle': 'треугольник',
  'star': 'звезда',
  'heart': 'сердце',
  'diamond': 'ромб',
  'hexagon': 'шестиугольник',
  'octagon': 'восьмиугольник',
  'pentagon': 'пятиугольник',

  // Стрелки и направления
  'arrow': 'стрелка',
  'up': 'вверх',
  'down': 'вниз',
  'left': 'влево',
  'right': 'вправо',
  'chevron': 'шеврон',
  'corner': 'угол',

  // Природа
  'sun': 'солнце',
  'moon': 'луна',
  'cloud': 'облако',
  'tree': 'дерево',
  'leaf': 'лист',
  'flower': 'цветок',
  'bird': 'птица',
  'cat': 'кот',
  'dog': 'собака',
  'fish': 'рыба',

  // Технология
  'wifi': 'wifi',
  'bluetooth': 'bluetooth',
  'battery': 'батарея',
  'phone': 'телефон',
  'camera': 'камера',
  'video': 'видео',
  'mic': 'микрофон',
  'microphone': 'микрофон',
  'speaker': 'динамик',
  'headphones': 'наушники',

  // Бизнес
  'file': 'файл',
  'folder': 'папка',
  'mail': 'почта',
  'calendar': 'календарь',
  'clock': 'часы',
  'user': 'пользователь',
  'users': 'пользователи',
  'building': 'здание',
  'home': 'дом',
  'store': 'магазин',

  // Символы
  'alert': 'предупреждение',
  'info': 'информация',
  'help': 'помощь',
  'question': 'вопрос',
  'warning': 'предупреждение',
  'error': 'ошибка',
  'success': 'успех',

  // Прочее
  'plus': 'плюс',
  'minus': 'минус',
  'x': 'x',
  'dot': 'точка',
  'line': 'линия',
  'box': 'коробка',
  'package': 'пакет',
  'gift': 'подарок',
  'tag': 'тег',
  'bookmark': 'закладка',
  'flag': 'флаг',
  'shield': 'щит',
  'badge': 'значок',
  'award': 'награда',
  'trophy': 'кубок',
  'medal': 'медаль',
  'crown': 'корона',
  'key': 'ключ',
  'bell': 'колокольчик',
  'music': 'музыка',
  'image': 'изображение',
  'map': 'карта',
  'globe': 'глобус',
  'book': 'книга',
  'pen': 'ручка',
  'pencil': 'карандаш',
  'brush': 'кисть',
  'palette': 'палитра',
  'paint': 'краска',
  'droplet': 'капля',
  'flame': 'пламя',
  'zap': 'молния',
  'bolt': 'болт',
  'sparkle': 'искра',
  'sparkles': 'искры',

  // Цифры и буквы
  '2': '2',
  '3': '3',
  '4': '4',
  'half': 'половина',
  'quarter': 'четверть',

  // Модификаторы
  'off': 'выкл',
  'on': 'вкл',
  'big': 'большой',
  'small': 'маленький',
  'dashed': 'пунктирный',
  'filled': 'заполненный',
  'outline': 'контур',
  'solid': 'сплошной',
};

// Функция для преобразования CamelCase в слова
function camelCaseToWords(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase();
}

// Функция для перевода названия иконки
function translateIconName(iconName) {
  // Убираем суффиксы вроде Icon, Solid и т.д.
  let cleanName = iconName
    .replace(/Icon$/i, '')
    .replace(/Solid$/i, '')
    .replace(/Outline$/i, '');

  // Преобразуем в слова
  const words = camelCaseToWords(cleanName).split(' ');

  // Переводим каждое слово
  const translatedWords = words.map(word => {
    const lower = word.toLowerCase();
    return translations[lower] || word;
  });

  // Собираем перевод
  let result = translatedWords.join(' ');

  // Первая буква заглавная
  result = result.charAt(0).toUpperCase() + result.slice(1);

  return result;
}

// Генерируем список иконок
async function generateAllIcons() {
  console.log('🔍 Загрузка Lucide иконок...');
  const lucideModule = await import('lucide-react');

  // Список экспортов, которые НЕ являются иконками
  const excludedLucideExports = new Set([
    'createLucideIcon',
    'default',
    'icons',
    'dynamicIconImports',
  ]);

  const lucideKeys = Object.keys(lucideModule).filter(key => {
    // Исключаем служебные экспорты
    if (excludedLucideExports.has(key)) {
      return false;
    }

    // Пропускаем иконки с суффиксом "Icon" (дубликаты)
    if (key.endsWith('Icon')) {
      return false;
    }

    const item = lucideModule[key];

    // Lucide иконки - это объекты (React.forwardRef) или функции
    // Имя должно начинаться с заглавной буквы
    return (typeof item === 'object' || typeof item === 'function') && /^[A-Z]/.test(key);
  });

  console.log('🔍 Загрузка Heroicons...');
  const heroModule = await import('@heroicons/react/24/solid');
  const heroKeys = Object.keys(heroModule);

  console.log(`📊 Найдено Lucide иконок: ${lucideKeys.length}`);
  console.log(`📊 Найдено Heroicons: ${heroKeys.length}`);
  console.log(`📊 Всего иконок: ${lucideKeys.length + heroKeys.length}`);

  // Генерируем массив иконок
  const allIcons = [];

  // Добавляем Lucide иконки
  for (const iconName of lucideKeys) {
    allIcons.push({
      name: iconName,
      source: 'lucide',
      displayName: translateIconName(iconName)
    });
  }

  // Добавляем Heroicons
  for (const iconName of heroKeys) {
    allIcons.push({
      name: iconName,
      source: 'heroicons',
      displayName: translateIconName(iconName)
    });
  }

  // Сортируем по displayName для удобства
  allIcons.sort((a, b) => a.displayName.localeCompare(b.displayName, 'ru'));

  console.log(`✅ Сгенерировано ${allIcons.length} иконок с переводами`);

  // Генерируем TypeScript файл
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'allIcons.ts');

  const fileContent = `// Автоматически сгенерированный файл со всеми доступными иконками
// Генерируется скриптом: scripts/generateAllIcons.js
// Всего иконок: ${allIcons.length}

import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';

export interface IconInfo {
  name: string;
  source: 'lucide' | 'heroicons';
  displayName: string;
}

export const allIcons: IconInfo[] = ${JSON.stringify(allIcons, null, 2)};

// Поиск иконок по запросу
export const searchAllIcons = (query: string): IconInfo[] => {
  if (!query || query.trim() === '') {
    return allIcons;
  }

  const lowerQuery = query.toLowerCase().trim();

  return allIcons.filter(
    (icon) =>
      icon.displayName.toLowerCase().includes(lowerQuery) ||
      icon.name.toLowerCase().includes(lowerQuery)
  );
};

// Получить все иконки
export const getAllIcons = (): IconInfo[] => {
  return allIcons;
};

// Получить предложения для автокомплита (максимум 10)
export const getAutocompleteSuggestions = (query: string, limit = 10): string[] => {
  if (!query || query.trim() === '') {
    return [];
  }

  const results = searchAllIcons(query);
  const uniqueDisplayNames = new Set<string>();

  for (const icon of results) {
    uniqueDisplayNames.add(icon.displayName);
    if (uniqueDisplayNames.size >= limit) {
      break;
    }
  }

  return Array.from(uniqueDisplayNames);
};

// Экспортируем компоненты иконок для использования в рендере
export { LucideIcons, HeroIcons };

console.log(\`✅ Загружено \${allIcons.length} иконок для поиска\`);
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`💾 Файл сохранен: ${outputPath}`);
  console.log('✨ Готово!');
}

// Запускаем генерацию
generateAllIcons().catch(console.error);
