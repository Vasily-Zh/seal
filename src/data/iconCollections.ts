// Динамическая загрузка всех иконок из библиотек lucide-react и heroicons
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';

export type IconCategory =
  | 'shapes'
  | 'stars'
  | 'arrows'
  | 'medical'
  | 'transport'
  | 'technology'
  | 'communication'
  | 'weather'
  | 'people'
  | 'business'
  | 'other';

export interface IconInfo {
  name: string;
  source: 'lucide' | 'heroicons' | 'custom';
  displayName: string;
}

// Функция для определения категории иконки по ее названию
function categorizeIcon(iconName: string): IconCategory {
  const lowerName = iconName.toLowerCase();

  // Фигуры
  if (
    lowerName.includes('square') ||
    lowerName.includes('circle') ||
    lowerName.includes('triangle') ||
    lowerName.includes('rectangle') ||
    lowerName.includes('hexagon') ||
    lowerName.includes('pentagon') ||
    lowerName.includes('octagon') ||
    lowerName.includes('diamond') ||
    lowerName.includes('shape')
  ) {
    return 'shapes';
  }

  // Звезды и связанные
  if (
    lowerName.includes('star') ||
    lowerName.includes('sparkle') ||
    lowerName.includes('sun') ||
    lowerName.includes('moon') ||
    lowerName.includes('cloud') ||
    lowerName.includes('snow')
  ) {
    return 'stars';
  }

  // Стрелки
  if (
    lowerName.includes('arrow') ||
    lowerName.includes('chevron') ||
    lowerName.includes('corner') ||
    lowerName.includes('move') ||
    lowerName.includes('trending')
  ) {
    return 'arrows';
  }

  // Медицина
  if (
    lowerName.includes('heart') ||
    lowerName.includes('pill') ||
    lowerName.includes('syringe') ||
    lowerName.includes('medical') ||
    lowerName.includes('hospital') ||
    lowerName.includes('stethoscope') ||
    lowerName.includes('thermometer') ||
    lowerName.includes('ambulance') ||
    lowerName.includes('cross') ||
    lowerName.includes('plus')
  ) {
    return 'medical';
  }

  // Транспорт
  if (
    lowerName.includes('car') ||
    lowerName.includes('bus') ||
    lowerName.includes('truck') ||
    lowerName.includes('plane') ||
    lowerName.includes('ship') ||
    lowerName.includes('train') ||
    lowerName.includes('bike') ||
    lowerName.includes('rocket') ||
    lowerName.includes('boat')
  ) {
    return 'transport';
  }

  // Технологии
  if (
    lowerName.includes('computer') ||
    lowerName.includes('phone') ||
    lowerName.includes('monitor') ||
    lowerName.includes('laptop') ||
    lowerName.includes('tablet') ||
    lowerName.includes('device') ||
    lowerName.includes('wifi') ||
    lowerName.includes('bluetooth') ||
    lowerName.includes('usb') ||
    lowerName.includes('cpu') ||
    lowerName.includes('hard')
  ) {
    return 'technology';
  }

  // Коммуникация
  if (
    lowerName.includes('mail') ||
    lowerName.includes('message') ||
    lowerName.includes('chat') ||
    lowerName.includes('phone') ||
    lowerName.includes('send') ||
    lowerName.includes('inbox') ||
    lowerName.includes('envelope')
  ) {
    return 'communication';
  }

  // Погода
  if (
    lowerName.includes('cloud') ||
    lowerName.includes('rain') ||
    lowerName.includes('snow') ||
    lowerName.includes('wind') ||
    lowerName.includes('umbrella') ||
    lowerName.includes('weather')
  ) {
    return 'weather';
  }

  // Люди
  if (
    lowerName.includes('user') ||
    lowerName.includes('person') ||
    lowerName.includes('people') ||
    lowerName.includes('team') ||
    lowerName.includes('group') ||
    lowerName.includes('face')
  ) {
    return 'people';
  }

  // Бизнес
  if (
    lowerName.includes('briefcase') ||
    lowerName.includes('building') ||
    lowerName.includes('bank') ||
    lowerName.includes('chart') ||
    lowerName.includes('graph') ||
    lowerName.includes('trending') ||
    lowerName.includes('dollar') ||
    lowerName.includes('coin') ||
    lowerName.includes('wallet')
  ) {
    return 'business';
  }

  return 'other';
}

// Функция для форматирования названия иконки в displayName
function formatDisplayName(iconName: string): string {
  // Разбиваем CamelCase на слова
  return iconName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .replace(/\s+/g, ' ');
}

// Получаем все иконки из lucide-react
function getLucideIcons(): IconInfo[] {
  const icons: IconInfo[] = [];

  // Исключаем не-иконки (утилиты, createLucideIcon и т.д.)
  const excludeList = ['createLucideIcon', 'Icon', 'LucideIcon', 'LucideProps', 'default'];

  Object.keys(LucideIcons).forEach((key) => {
    // В ES modules компоненты экспортируются как object, не function
    // Фильтруем: только uppercase компоненты, исключаем утилиты и дубликаты с суффиксом "Icon"
    if (
      !excludeList.includes(key) &&
      key[0] === key[0].toUpperCase() && // Компоненты начинаются с заглавной буквы
      !key.endsWith('Icon') && // Исключаем дубликаты (каждая иконка экспортируется дважды: Star и StarIcon)
      LucideIcons[key as keyof typeof LucideIcons] // Проверяем что существует
    ) {
      icons.push({
        name: key,
        source: 'lucide',
        displayName: formatDisplayName(key),
      });
    }
  });

  return icons;
}

// Получаем все иконки из heroicons
function getHeroIcons(): IconInfo[] {
  const icons: IconInfo[] = [];

  Object.keys(HeroIcons).forEach((key) => {
    // В heroicons все иконки уже имеют суффикс Icon, поэтому просто фильтруем по uppercase
    if (
      key !== 'default' &&
      key[0] === key[0].toUpperCase() &&
      HeroIcons[key as keyof typeof HeroIcons] // Проверяем что существует
    ) {
      icons.push({
        name: key,
        source: 'heroicons',
        displayName: formatDisplayName(key),
      });
    }
  });

  return icons;
}

// Собираем все иконки
const allLucideIcons = getLucideIcons();
const allHeroIcons = getHeroIcons();
const allIcons = [...allLucideIcons, ...allHeroIcons];

console.log(`Загружено иконок: Lucide - ${allLucideIcons.length}, Heroicons - ${allHeroIcons.length}, Всего - ${allIcons.length}`);

// Группируем иконки по категориям
const iconsByCategory: Record<IconCategory, IconInfo[]> = {
  shapes: [],
  stars: [],
  arrows: [],
  medical: [],
  transport: [],
  technology: [],
  communication: [],
  weather: [],
  people: [],
  business: [],
  other: [],
};

// Распределяем иконки по категориям
allIcons.forEach((icon) => {
  const category = categorizeIcon(icon.name);
  iconsByCategory[category].push(icon);
});

// Экспортируем категории
export const categories: { id: IconCategory; name: string; icons: IconInfo[] }[] = [
  { id: 'shapes', name: 'Фигуры', icons: iconsByCategory.shapes },
  { id: 'stars', name: 'Звезды и погода', icons: iconsByCategory.stars },
  { id: 'arrows', name: 'Стрелки и направления', icons: iconsByCategory.arrows },
  { id: 'medical', name: 'Медицина', icons: iconsByCategory.medical },
  { id: 'transport', name: 'Транспорт', icons: iconsByCategory.transport },
  { id: 'technology', name: 'Технологии', icons: iconsByCategory.technology },
  { id: 'communication', name: 'Коммуникация', icons: iconsByCategory.communication },
  { id: 'weather', name: 'Погода', icons: iconsByCategory.weather },
  { id: 'people', name: 'Люди', icons: iconsByCategory.people },
  { id: 'business', name: 'Бизнес', icons: iconsByCategory.business },
  { id: 'other', name: 'Другое', icons: iconsByCategory.other },
];

// Получить иконки по категории
export const getIconsByCategory = (category: IconCategory): IconInfo[] => {
  return iconsByCategory[category] || [];
};

// Поиск иконок по имени
export const searchIcons = (query: string): IconInfo[] => {
  const lowerQuery = query.toLowerCase();
  return allIcons.filter(
    (icon) =>
      icon.displayName.toLowerCase().includes(lowerQuery) ||
      icon.name.toLowerCase().includes(lowerQuery)
  );
};

// Экспортируем все иконки для использования в компонентах
export const getAllIcons = (): IconInfo[] => allIcons;
