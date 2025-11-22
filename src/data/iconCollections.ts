// Коллекции иконок для разных категорий

export type IconCategory =
  | 'shapes'
  | 'emblems'
  | 'lines'
  | 'stars'
  | 'crosses'
  | 'medical'
  | 'transport'
  | 'decorative'
  | 'government';

export interface IconInfo {
  name: string;
  source: 'lucide' | 'heroicons' | 'custom';
  displayName: string;
}

// Фигуры (геометрические фигуры для печатей)
export const shapesIcons: IconInfo[] = [
  { name: 'Square', source: 'lucide', displayName: 'Квадрат' },
  { name: 'Circle', source: 'lucide', displayName: 'Круг' },
  { name: 'Triangle', source: 'lucide', displayName: 'Треугольник' },
  { name: 'Pentagon', source: 'lucide', displayName: 'Пятиугольник' },
  { name: 'Hexagon', source: 'lucide', displayName: 'Шестиугольник' },
  { name: 'Octagon', source: 'lucide', displayName: 'Восьмиугольник' },
  { name: 'Diamond', source: 'lucide', displayName: 'Ромб' },
  { name: 'RectangleHorizontal', source: 'lucide', displayName: 'Прямоугольник' },
  { name: 'RectangleVertical', source: 'lucide', displayName: 'Прямоугольник вертикальный' },
  { name: 'SquareDashedBottom', source: 'lucide', displayName: 'Квадрат с пунктиром' },
  { name: 'CircleDashed', source: 'lucide', displayName: 'Круг с пунктиром' },
  { name: 'SquareDashed', source: 'lucide', displayName: 'Квадрат пунктирный' },
  { name: 'Shapes', source: 'lucide', displayName: 'Фигуры' },
  { name: 'Component', source: 'lucide', displayName: 'Компонент' },
  { name: 'Box', source: 'lucide', displayName: 'Коробка' },
  { name: 'SquareStack', source: 'heroicons', displayName: 'Стопка квадратов' },
  { name: 'Stop', source: 'heroicons', displayName: 'Стоп' },
  { name: 'MinusCircle', source: 'heroicons', displayName: 'Круг с минусом' },
  { name: 'PlusCircle', source: 'heroicons', displayName: 'Круг с плюсом' },
  { name: 'StopCircle', source: 'heroicons', displayName: 'Круг стоп' },
  { name: 'Ellipsis', source: 'lucide', displayName: 'Эллипс' },
  { name: 'SquareCheckBig', source: 'lucide', displayName: 'Квадрат с галочкой' },
  { name: 'SquareDivide', source: 'lucide', displayName: 'Разделенный квадрат' },
  { name: 'SquareSplitVertical', source: 'lucide', displayName: 'Разделенный вертикально' },
  { name: 'SquareSplitHorizontal', source: 'lucide', displayName: 'Разделенный горизонтально' },
];

// Гербы (пока пустой, будет заполнен custom SVG)
export const emblemsIcons: IconInfo[] = [
  { name: 'Shield', source: 'lucide', displayName: 'Щит' },
  { name: 'ShieldCheck', source: 'lucide', displayName: 'Щит с галочкой' },
  { name: 'ShieldAlert', source: 'lucide', displayName: 'Щит с предупреждением' },
  { name: 'ShieldPlus', source: 'lucide', displayName: 'Щит с плюсом' },
  { name: 'Crown', source: 'lucide', displayName: 'Корона' },
  { name: 'Award', source: 'lucide', displayName: 'Награда' },
  { name: 'Medal', source: 'lucide', displayName: 'Медаль' },
  { name: 'Trophy', source: 'lucide', displayName: 'Трофей' },
  { name: 'ShieldHalf', source: 'lucide', displayName: 'Половина щита' },
  { name: 'Flame', source: 'lucide', displayName: 'Пламя' },
  // Custom гербы России будут добавлены позже
];

// Линии
export const linesIcons: IconInfo[] = [
  { name: 'Minus', source: 'lucide', displayName: 'Горизонтальная линия' },
  { name: 'MoveHorizontal', source: 'lucide', displayName: 'Двойная горизонтальная' },
  { name: 'MoveVertical', source: 'lucide', displayName: 'Двойная вертикальная' },
  { name: 'Equal', source: 'lucide', displayName: 'Равно' },
  { name: 'Divide', source: 'lucide', displayName: 'Деление' },
  { name: 'Slash', source: 'lucide', displayName: 'Слэш' },
  { name: 'SeparatorHorizontal', source: 'lucide', displayName: 'Разделитель горизонтальный' },
  { name: 'SeparatorVertical', source: 'lucide', displayName: 'Разделитель вертикальный' },
  { name: 'WavyLine', source: 'lucide', displayName: 'Волнистая линия' },
  { name: 'ArrowRight', source: 'lucide', displayName: 'Стрелка вправо' },
  { name: 'ArrowLeft', source: 'lucide', displayName: 'Стрелка влево' },
  { name: 'ArrowUp', source: 'lucide', displayName: 'Стрелка вверх' },
  { name: 'ArrowDown', source: 'lucide', displayName: 'Стрелка вниз' },
  { name: 'ChevronsRight', source: 'lucide', displayName: 'Двойная стрелка вправо' },
  { name: 'ChevronsLeft', source: 'lucide', displayName: 'Двойная стрелка влево' },
  { name: 'ChevronsUp', source: 'lucide', displayName: 'Двойная стрелка вверх' },
  { name: 'ChevronsDown', source: 'lucide', displayName: 'Двойная стрелка вниз' },
  { name: 'ArrowBigRight', source: 'lucide', displayName: 'Большая стрелка вправо' },
  { name: 'ArrowBigLeft', source: 'lucide', displayName: 'Большая стрелка влево' },
  { name: 'ArrowBigUp', source: 'lucide', displayName: 'Большая стрелка вверх' },
  { name: 'ArrowBigDown', source: 'lucide', displayName: 'Большая стрелка вниз' },
  { name: 'CornerDownRight', source: 'lucide', displayName: 'Угловая стрелка' },
  { name: 'TrendingUp', source: 'lucide', displayName: 'Линия тренда вверх' },
  { name: 'TrendingDown', source: 'lucide', displayName: 'Линия тренда вниз' },
  { name: 'Workflow', source: 'lucide', displayName: 'Линии потока' },
];

// Звезды и снежинки
export const starsIcons: IconInfo[] = [
  { name: 'Star', source: 'lucide', displayName: 'Звезда' },
  { name: 'StarHalf', source: 'lucide', displayName: 'Половина звезды' },
  { name: 'StarOff', source: 'lucide', displayName: 'Пустая звезда' },
  { name: 'Stars', source: 'lucide', displayName: 'Звезды' },
  { name: 'Sparkle', source: 'lucide', displayName: 'Искра' },
  { name: 'Sparkles', source: 'lucide', displayName: 'Искры' },
  { name: 'Asterisk', source: 'lucide', displayName: 'Астериск' },
  { name: 'Snowflake', source: 'lucide', displayName: 'Снежинка' },
  { name: 'Star', source: 'heroicons', displayName: 'Звезда героик' },
  { name: 'Sparkles', source: 'heroicons', displayName: 'Искры героик' },
  { name: 'Sun', source: 'lucide', displayName: 'Солнце' },
  { name: 'Moon', source: 'lucide', displayName: 'Луна' },
  { name: 'Zap', source: 'lucide', displayName: 'Молния' },
  { name: 'Flame', source: 'lucide', displayName: 'Огонь' },
  { name: 'Sunrise', source: 'lucide', displayName: 'Рассвет' },
  { name: 'Sunset', source: 'lucide', displayName: 'Закат' },
  { name: 'SunMedium', source: 'lucide', displayName: 'Солнце средний' },
  { name: 'SunMoon', source: 'lucide', displayName: 'Солнце и луна' },
  { name: 'Eclipse', source: 'lucide', displayName: 'Затмение' },
  { name: 'Comet', source: 'lucide', displayName: 'Комета' },
  { name: 'CloudRain', source: 'lucide', displayName: 'Облако с дождем' },
  { name: 'CloudSnow', source: 'lucide', displayName: 'Облако со снегом' },
  { name: 'CloudSun', source: 'lucide', displayName: 'Облако с солнцем' },
  { name: 'CloudMoon', source: 'lucide', displayName: 'Облако с луной' },
  { name: 'Cloudy', source: 'lucide', displayName: 'Облачно' },
];

// Кресты
export const crossesIcons: IconInfo[] = [
  { name: 'Plus', source: 'lucide', displayName: 'Плюс' },
  { name: 'X', source: 'lucide', displayName: 'Крестик' },
  { name: 'XCircle', source: 'lucide', displayName: 'Крест в круге' },
  { name: 'XSquare', source: 'lucide', displayName: 'Крест в квадрате' },
  { name: 'PlusCircle', source: 'lucide', displayName: 'Плюс в круге' },
  { name: 'PlusSquare', source: 'lucide', displayName: 'Плюс в квадрате' },
  { name: 'Cross', source: 'lucide', displayName: 'Крест' },
  { name: 'XCircle', source: 'heroicons', displayName: 'X в круге' },
  { name: 'PlusCircle', source: 'heroicons', displayName: 'Плюс в круге героик' },
  { name: 'XMark', source: 'heroicons', displayName: 'Крестик героик' },
  { name: 'Heart', source: 'lucide', displayName: 'Сердце' },
  { name: 'Bone', source: 'lucide', displayName: 'Кость' },
  { name: 'Activity', source: 'lucide', displayName: 'Активность' },
  { name: 'Asterisk', source: 'lucide', displayName: 'Звездочка' },
  { name: 'Maximize', source: 'lucide', displayName: 'Развернуть' },
  { name: 'Minimize', source: 'lucide', displayName: 'Свернуть' },
  { name: 'Maximize2', source: 'lucide', displayName: 'Развернуть 2' },
  { name: 'Minimize2', source: 'lucide', displayName: 'Свернуть 2' },
  { name: 'Crosshair', source: 'lucide', displayName: 'Прицел' },
  { name: 'Target', source: 'lucide', displayName: 'Мишень' },
  { name: 'Focus', source: 'lucide', displayName: 'Фокус' },
  { name: 'Anchor', source: 'lucide', displayName: 'Якорь' },
  { name: 'Move', source: 'lucide', displayName: 'Перемещение' },
  { name: 'Navigation', source: 'lucide', displayName: 'Навигация' },
  { name: 'Compass', source: 'lucide', displayName: 'Компас' },
];

// Медицина
export const medicalIcons: IconInfo[] = [
  { name: 'Heart', source: 'lucide', displayName: 'Сердце' },
  { name: 'HeartPulse', source: 'lucide', displayName: 'Пульс сердца' },
  { name: 'Activity', source: 'lucide', displayName: 'Кардиограмма' },
  { name: 'Cross', source: 'lucide', displayName: 'Медицинский крест' },
  { name: 'PlusCircle', source: 'lucide', displayName: 'Аптечка' },
  { name: 'Pill', source: 'lucide', displayName: 'Таблетка' },
  { name: 'Syringe', source: 'lucide', displayName: 'Шприц' },
  { name: 'Stethoscope', source: 'lucide', displayName: 'Стетоскоп' },
  { name: 'Thermometer', source: 'lucide', displayName: 'Термометр' },
  { name: 'Hospital', source: 'lucide', displayName: 'Больница' },
  { name: 'Ambulance', source: 'lucide', displayName: 'Скорая помощь' },
  { name: 'HeartHandshake', source: 'lucide', displayName: 'Рукопожатие' },
  { name: 'Bone', source: 'lucide', displayName: 'Кость' },
  { name: 'Brain', source: 'lucide', displayName: 'Мозг' },
  { name: 'Dna', source: 'lucide', displayName: 'ДНК' },
  { name: 'Microscope', source: 'lucide', displayName: 'Микроскоп' },
  { name: 'TestTube', source: 'lucide', displayName: 'Пробирка' },
  { name: 'Droplet', source: 'lucide', displayName: 'Капля' },
  { name: 'Droplets', source: 'lucide', displayName: 'Капли' },
  { name: 'Eye', source: 'lucide', displayName: 'Глаз' },
  { name: 'EyeOff', source: 'lucide', displayName: 'Глаз закрытый' },
  { name: 'Ear', source: 'lucide', displayName: 'Ухо' },
  { name: 'Hand', source: 'lucide', displayName: 'Рука' },
  { name: 'Fingerprint', source: 'lucide', displayName: 'Отпечаток' },
  { name: 'Cigarette', source: 'lucide', displayName: 'Сигарета' },
];

// Транспорт
export const transportIcons: IconInfo[] = [
  { name: 'Car', source: 'lucide', displayName: 'Машина' },
  { name: 'Bus', source: 'lucide', displayName: 'Автобус' },
  { name: 'Truck', source: 'lucide', displayName: 'Грузовик' },
  { name: 'Plane', source: 'lucide', displayName: 'Самолет' },
  { name: 'Ship', source: 'lucide', displayName: 'Корабль' },
  { name: 'Train', source: 'lucide', displayName: 'Поезд' },
  { name: 'Bike', source: 'lucide', displayName: 'Велосипед' },
  { name: 'Rocket', source: 'lucide', displayName: 'Ракета' },
  { name: 'Tractor', source: 'lucide', displayName: 'Трактор' },
  { name: 'CarFront', source: 'lucide', displayName: 'Машина вид спереди' },
  { name: 'CarTaxiFront', source: 'lucide', displayName: 'Такси' },
  { name: 'Ambulance', source: 'lucide', displayName: 'Скорая' },
  { name: 'PlaneTakeoff', source: 'lucide', displayName: 'Самолет взлет' },
  { name: 'PlaneLanding', source: 'lucide', displayName: 'Самолет посадка' },
  { name: 'TrainFront', source: 'lucide', displayName: 'Поезд вид спереди' },
  { name: 'TrainTrack', source: 'lucide', displayName: 'Железная дорога' },
  { name: 'Anchor', source: 'lucide', displayName: 'Якорь' },
  { name: 'Sailboat', source: 'lucide', displayName: 'Парусник' },
  { name: 'Ferry', source: 'lucide', displayName: 'Паром' },
  { name: 'Ship', source: 'heroicons', displayName: 'Корабль героик' },
  { name: 'TramFront', source: 'lucide', displayName: 'Трамвай' },
  { name: 'Construction', source: 'lucide', displayName: 'Конструкция' },
  { name: 'Fuel', source: 'lucide', displayName: 'Топливо' },
  { name: 'CableCar', source: 'lucide', displayName: 'Канатная дорога' },
  { name: 'TrafficCone', source: 'lucide', displayName: 'Дорожный конус' },
];

// Элементы украшения
export const decorativeIcons: IconInfo[] = [
  { name: 'Flower', source: 'lucide', displayName: 'Цветок' },
  { name: 'Flower2', source: 'lucide', displayName: 'Цветок 2' },
  { name: 'Leaf', source: 'lucide', displayName: 'Лист' },
  { name: 'Trees', source: 'lucide', displayName: 'Деревья' },
  { name: 'TreePine', source: 'lucide', displayName: 'Сосна' },
  { name: 'TreeDeciduous', source: 'lucide', displayName: 'Дерево' },
  { name: 'Clover', source: 'lucide', displayName: 'Клевер' },
  { name: 'Sparkle', source: 'lucide', displayName: 'Искра' },
  { name: 'Sparkles', source: 'lucide', displayName: 'Искры' },
  { name: 'Gem', source: 'lucide', displayName: 'Драгоценность' },
  { name: 'Diamond', source: 'lucide', displayName: 'Бриллиант' },
  { name: 'Heart', source: 'lucide', displayName: 'Сердце' },
  { name: 'HeartHandshake', source: 'lucide', displayName: 'Рукопожатие сердца' },
  { name: 'Gift', source: 'lucide', displayName: 'Подарок' },
  { name: 'Cake', source: 'lucide', displayName: 'Торт' },
  { name: 'PartyPopper', source: 'lucide', displayName: 'Хлопушка' },
  { name: 'Ribbon', source: 'lucide', displayName: 'Лента' },
  { name: 'Archive', source: 'lucide', displayName: 'Архив' },
  { name: 'Footprints', source: 'lucide', displayName: 'Следы' },
  { name: 'Infinity', source: 'lucide', displayName: 'Бесконечность' },
  { name: 'Music', source: 'lucide', displayName: 'Музыка' },
  { name: 'Music2', source: 'lucide', displayName: 'Музыка 2' },
  { name: 'Music3', source: 'lucide', displayName: 'Музыка 3' },
  { name: 'Music4', source: 'lucide', displayName: 'Музыка 4' },
  { name: 'Palette', source: 'lucide', displayName: 'Палитра' },
];

// Государство и право
export const governmentIcons: IconInfo[] = [
  { name: 'Flag', source: 'lucide', displayName: 'Флаг' },
  { name: 'Building', source: 'lucide', displayName: 'Здание' },
  { name: 'Building2', source: 'lucide', displayName: 'Здание 2' },
  { name: 'Landmark', source: 'lucide', displayName: 'Монумент' },
  { name: 'Scale', source: 'lucide', displayName: 'Весы' },
  { name: 'Gavel', source: 'lucide', displayName: 'Молоток судьи' },
  { name: 'BookOpen', source: 'lucide', displayName: 'Открытая книга' },
  { name: 'ScrollText', source: 'lucide', displayName: 'Свиток' },
  { name: 'FileText', source: 'lucide', displayName: 'Документ' },
  { name: 'Stamp', source: 'lucide', displayName: 'Печать' },
  { name: 'Shield', source: 'lucide', displayName: 'Щит' },
  { name: 'ShieldCheck', source: 'lucide', displayName: 'Щит с галочкой' },
  { name: 'Award', source: 'lucide', displayName: 'Награда' },
  { name: 'Medal', source: 'lucide', displayName: 'Медаль' },
  { name: 'Trophy', source: 'lucide', displayName: 'Трофей' },
  { name: 'Crown', source: 'lucide', displayName: 'Корона' },
  { name: 'Briefcase', source: 'lucide', displayName: 'Портфель' },
  { name: 'Banknote', source: 'lucide', displayName: 'Банкнота' },
  { name: 'Coins', source: 'lucide', displayName: 'Монеты' },
  { name: 'Receipt', source: 'lucide', displayName: 'Чек' },
  { name: 'Wallet', source: 'lucide', displayName: 'Кошелек' },
  { name: 'BadgeCheck', source: 'lucide', displayName: 'Значок с галочкой' },
  { name: 'UserCheck', source: 'lucide', displayName: 'Проверенный пользователь' },
  { name: 'Users', source: 'lucide', displayName: 'Пользователи' },
  { name: 'GraduationCap', source: 'lucide', displayName: 'Шапочка выпускника' },
];

// Категории с описаниями
export const categories: { id: IconCategory; name: string; icons: IconInfo[] }[] = [
  { id: 'stars', name: 'Звезды и снежинки', icons: starsIcons },
  { id: 'shapes', name: 'Фигуры', icons: shapesIcons },
  { id: 'emblems', name: 'Гербы', icons: emblemsIcons },
  { id: 'lines', name: 'Линии', icons: linesIcons },
  { id: 'crosses', name: 'Кресты', icons: crossesIcons },
  { id: 'medical', name: 'Медицина', icons: medicalIcons },
  { id: 'transport', name: 'Транспорт', icons: transportIcons },
  { id: 'decorative', name: 'Элементы украшения', icons: decorativeIcons },
  { id: 'government', name: 'Государство и право', icons: governmentIcons },
];

// Получить иконки по категории
export const getIconsByCategory = (category: IconCategory): IconInfo[] => {
  const cat = categories.find((c) => c.id === category);
  return cat ? cat.icons : [];
};

// Поиск иконок по имени
export const searchIcons = (query: string): IconInfo[] => {
  const lowerQuery = query.toLowerCase();
  return categories.flatMap((cat) =>
    cat.icons.filter(
      (icon) =>
        icon.displayName.toLowerCase().includes(lowerQuery) ||
        icon.name.toLowerCase().includes(lowerQuery)
    )
  );
};
