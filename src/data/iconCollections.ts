// Кураторские коллекции иконок для создания штампов
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';

export type IconCategory =
  | 'shapes'
  | 'stars'
  | 'arrows'
  | 'nature'
  | 'symbols'
  | 'business'
  | 'decorative'
  | 'badges';

export interface IconInfo {
  name: string;
  source: 'lucide' | 'heroicons';
  displayName: string;
}

// Функция для форматирования названия иконки (не используется, т.к. displayName заданы вручную)
// function formatDisplayName(iconName: string): string {
//   return iconName
//     .replace(/([A-Z])/g, ' $1')
//     .trim()
//     .replace(/\s+/g, ' ');
// }

// Кураторская коллекция: Фигуры (подходящие для штампов)
const shapesIcons: IconInfo[] = [
  // Базовые фигуры
  { name: 'Circle', source: 'lucide', displayName: 'Круг' },
  { name: 'Square', source: 'lucide', displayName: 'Квадрат' },
  { name: 'Triangle', source: 'lucide', displayName: 'Треугольник' },
  { name: 'Hexagon', source: 'lucide', displayName: 'Шестиугольник' },
  { name: 'Pentagon', source: 'lucide', displayName: 'Пятиугольник' },
  { name: 'Octagon', source: 'lucide', displayName: 'Восьмиугольник' },
  { name: 'Diamond', source: 'lucide', displayName: 'Ромб' },

  // Круги и окружности
  { name: 'CircleDot', source: 'lucide', displayName: 'Круг с точкой' },
  { name: 'CircleDashed', source: 'lucide', displayName: 'Пунктирный круг' },
  { name: 'CircleOff', source: 'lucide', displayName: 'Перечеркнутый круг' },
  { name: 'Disc', source: 'lucide', displayName: 'Диск' },
  { name: 'Disc2', source: 'lucide', displayName: 'Диск 2' },
  { name: 'Disc3', source: 'lucide', displayName: 'Диск 3' },
  { name: 'Donut', source: 'lucide', displayName: 'Кольцо' },

  // Квадраты и прямоугольники
  { name: 'SquareDashed', source: 'lucide', displayName: 'Пунктирный квадрат' },
  { name: 'RectangleHorizontal', source: 'lucide', displayName: 'Прямоугольник горизонтальный' },
  { name: 'RectangleVertical', source: 'lucide', displayName: 'Прямоугольник вертикальный' },
  { name: 'SquareStack', source: 'lucide', displayName: 'Стопка квадратов' },

  // Rounded shapes
  { name: 'RoundedCorner', source: 'lucide', displayName: 'Закругленный угол' },

  // Полукруги и арки
  { name: 'CircleHalf', source: 'lucide', displayName: 'Полукруг' },

  // Треугольники
  { name: 'TriangleAlert', source: 'lucide', displayName: 'Треугольник предупреждения' },

  // Кресты и плюсы
  { name: 'Plus', source: 'lucide', displayName: 'Плюс' },
  { name: 'Cross', source: 'lucide', displayName: 'Крест' },
  { name: 'X', source: 'lucide', displayName: 'X' },

  // Линии
  { name: 'Minus', source: 'lucide', displayName: 'Минус' },
  { name: 'Divide', source: 'lucide', displayName: 'Деление' },

  // Специальные фигуры
  { name: 'Heart', source: 'lucide', displayName: 'Сердце' },
  { name: 'Shield', source: 'lucide', displayName: 'Щит' },
  { name: 'ShieldCheck', source: 'lucide', displayName: 'Щит с галочкой' },
  { name: 'ShieldAlert', source: 'lucide', displayName: 'Щит с предупреждением' },

  // Декоративные рамки
  { name: 'Frame', source: 'lucide', displayName: 'Рамка' },
  { name: 'Box', source: 'lucide', displayName: 'Коробка' },
  { name: 'Package', source: 'lucide', displayName: 'Пакет' },
];

// Кураторская коллекция: Звезды и снежинки
const starsIcons: IconInfo[] = [
  // Звезды
  { name: 'Star', source: 'lucide', displayName: 'Звезда' },
  { name: 'StarHalf', source: 'lucide', displayName: 'Половина звезды' },
  { name: 'StarOff', source: 'lucide', displayName: 'Пустая звезда' },
  { name: 'Sparkle', source: 'lucide', displayName: 'Искра' },
  { name: 'Sparkles', source: 'lucide', displayName: 'Искры' },
  { name: 'Stars', source: 'lucide', displayName: 'Звезды' },

  // Снежинки
  { name: 'Snowflake', source: 'lucide', displayName: 'Снежинка' },

  // Цветы и декоративные элементы
  { name: 'Flower', source: 'lucide', displayName: 'Цветок' },
  { name: 'Flower2', source: 'lucide', displayName: 'Цветок 2' },
  { name: 'Clover', source: 'lucide', displayName: 'Клевер' },

  // Солнце и луна
  { name: 'Sun', source: 'lucide', displayName: 'Солнце' },
  { name: 'SunMoon', source: 'lucide', displayName: 'Солнце и луна' },
  { name: 'Moon', source: 'lucide', displayName: 'Луна' },
  { name: 'MoonStar', source: 'lucide', displayName: 'Луна со звездой' },

  // Вспышки и сияния
  { name: 'Zap', source: 'lucide', displayName: 'Молния' },
  { name: 'Flame', source: 'lucide', displayName: 'Пламя' },
];

// Кураторская коллекция: Стрелки
const arrowsIcons: IconInfo[] = [
  // Простые стрелки
  { name: 'ArrowUp', source: 'lucide', displayName: 'Стрелка вверх' },
  { name: 'ArrowDown', source: 'lucide', displayName: 'Стрелка вниз' },
  { name: 'ArrowLeft', source: 'lucide', displayName: 'Стрелка влево' },
  { name: 'ArrowRight', source: 'lucide', displayName: 'Стрелка вправо' },

  // Диагональные стрелки
  { name: 'ArrowUpLeft', source: 'lucide', displayName: 'Стрелка влево-вверх' },
  { name: 'ArrowUpRight', source: 'lucide', displayName: 'Стрелка вправо-вверх' },
  { name: 'ArrowDownLeft', source: 'lucide', displayName: 'Стрелка влево-вниз' },
  { name: 'ArrowDownRight', source: 'lucide', displayName: 'Стрелка вправо-вниз' },

  // Круговые стрелки
  { name: 'ArrowBigUp', source: 'lucide', displayName: 'Большая стрелка вверх' },
  { name: 'ArrowBigDown', source: 'lucide', displayName: 'Большая стрелка вниз' },
  { name: 'ArrowBigLeft', source: 'lucide', displayName: 'Большая стрелка влево' },
  { name: 'ArrowBigRight', source: 'lucide', displayName: 'Большая стрелка вправо' },

  // Стрелки с кругами
  { name: 'ArrowUpCircle', source: 'lucide', displayName: 'Стрелка вверх в круге' },
  { name: 'ArrowDownCircle', source: 'lucide', displayName: 'Стрелка вниз в круге' },
  { name: 'ArrowLeftCircle', source: 'lucide', displayName: 'Стрелка влево в круге' },
  { name: 'ArrowRightCircle', source: 'lucide', displayName: 'Стрелка вправо в круге' },

  // Стрелки с квадратами
  { name: 'ArrowUpSquare', source: 'lucide', displayName: 'Стрелка вверх в квадрате' },
  { name: 'ArrowDownSquare', source: 'lucide', displayName: 'Стрелка вниз в квадрате' },
  { name: 'ArrowLeftSquare', source: 'lucide', displayName: 'Стрелка влево в квадрате' },
  { name: 'ArrowRightSquare', source: 'lucide', displayName: 'Стрелка вправо в квадрате' },

  // Двойные стрелки
  { name: 'ArrowUpDown', source: 'lucide', displayName: 'Стрелки вверх-вниз' },
  { name: 'ArrowLeftRight', source: 'lucide', displayName: 'Стрелки влево-вправо' },

  // Круговые движения
  { name: 'RotateCw', source: 'lucide', displayName: 'Вращение по часовой' },
  { name: 'RotateCcw', source: 'lucide', displayName: 'Вращение против часовой' },
  { name: 'Repeat', source: 'lucide', displayName: 'Повтор' },
  { name: 'Repeat1', source: 'lucide', displayName: 'Повтор 1' },
  { name: 'Repeat2', source: 'lucide', displayName: 'Повтор 2' },
  { name: 'RefreshCw', source: 'lucide', displayName: 'Обновить' },
  { name: 'RefreshCcw', source: 'lucide', displayName: 'Обновить против часовой' },

  // Специальные стрелки
  { name: 'ChevronUp', source: 'lucide', displayName: 'Шеврон вверх' },
  { name: 'ChevronDown', source: 'lucide', displayName: 'Шеврон вниз' },
  { name: 'ChevronLeft', source: 'lucide', displayName: 'Шеврон влево' },
  { name: 'ChevronRight', source: 'lucide', displayName: 'Шеврон вправо' },

  // Двойные шевроны
  { name: 'ChevronsUp', source: 'lucide', displayName: 'Двойной шеврон вверх' },
  { name: 'ChevronsDown', source: 'lucide', displayName: 'Двойной шеврон вниз' },
  { name: 'ChevronsLeft', source: 'lucide', displayName: 'Двойной шеврон влево' },
  { name: 'ChevronsRight', source: 'lucide', displayName: 'Двойной шеврон вправо' },

  // Стрелки импорта/экспорта
  { name: 'Import', source: 'lucide', displayName: 'Импорт' },
  { name: 'Export', source: 'lucide', displayName: 'Экспорт' },
  { name: 'Upload', source: 'lucide', displayName: 'Загрузить' },
  { name: 'Download', source: 'lucide', displayName: 'Скачать' },

  // Движение
  { name: 'Move', source: 'lucide', displayName: 'Переместить' },
  { name: 'MoveUp', source: 'lucide', displayName: 'Переместить вверх' },
  { name: 'MoveDown', source: 'lucide', displayName: 'Переместить вниз' },
  { name: 'MoveLeft', source: 'lucide', displayName: 'Переместить влево' },
  { name: 'MoveRight', source: 'lucide', displayName: 'Переместить вправо' },
];

// Кураторская коллекция: Природа и животные
const natureIcons: IconInfo[] = [
  // Растения
  { name: 'Leaf', source: 'lucide', displayName: 'Лист' },
  { name: 'Leaves', source: 'lucide', displayName: 'Листья' },
  { name: 'Tree', source: 'lucide', displayName: 'Дерево' },
  { name: 'TreeDeciduous', source: 'lucide', displayName: 'Лиственное дерево' },
  { name: 'TreePine', source: 'lucide', displayName: 'Сосна' },
  { name: 'Sprout', source: 'lucide', displayName: 'Росток' },

  // Цветы (дополнительные)
  { name: 'Cherry', source: 'lucide', displayName: 'Вишня' },

  // Животные
  { name: 'Bird', source: 'lucide', displayName: 'Птица' },
  { name: 'Bug', source: 'lucide', displayName: 'Жук' },
  { name: 'Cat', source: 'lucide', displayName: 'Кот' },
  { name: 'Dog', source: 'lucide', displayName: 'Собака' },
  { name: 'Fish', source: 'lucide', displayName: 'Рыба' },
  { name: 'Rabbit', source: 'lucide', displayName: 'Кролик' },
  { name: 'Squirrel', source: 'lucide', displayName: 'Белка' },
  { name: 'Turtle', source: 'lucide', displayName: 'Черепаха' },

  // Лапы и следы
  { name: 'Footprints', source: 'lucide', displayName: 'Следы' },
  { name: 'PawPrint', source: 'lucide', displayName: 'Лапа' },

  // Глобус и земля
  { name: 'Globe', source: 'lucide', displayName: 'Глобус' },
  { name: 'Globe2', source: 'lucide', displayName: 'Глобус 2' },
  { name: 'Mountain', source: 'lucide', displayName: 'Гора' },
  { name: 'Mountains', source: 'lucide', displayName: 'Горы' },
  { name: 'Waves', source: 'lucide', displayName: 'Волны' },
];

// Кураторская коллекция: Символы и знаки
const symbolsIcons: IconInfo[] = [
  // Галочки и проверки
  { name: 'Check', source: 'lucide', displayName: 'Галочка' },
  { name: 'CheckCheck', source: 'lucide', displayName: 'Двойная галочка' },
  { name: 'CheckCircle', source: 'lucide', displayName: 'Галочка в круге' },
  { name: 'CheckCircle2', source: 'lucide', displayName: 'Галочка в круге 2' },
  { name: 'CheckSquare', source: 'lucide', displayName: 'Галочка в квадрате' },

  // Предупреждения
  { name: 'AlertCircle', source: 'lucide', displayName: 'Предупреждение в круге' },
  { name: 'AlertTriangle', source: 'lucide', displayName: 'Предупреждение в треугольнике' },
  { name: 'AlertOctagon', source: 'lucide', displayName: 'Предупреждение в восьмиугольнике' },
  { name: 'Info', source: 'lucide', displayName: 'Информация' },

  // Вопросительные и восклицательные знаки
  { name: 'HelpCircle', source: 'lucide', displayName: 'Вопрос в круге' },
  { name: 'Ban', source: 'lucide', displayName: 'Запрет' },
  { name: 'XCircle', source: 'lucide', displayName: 'X в круге' },
  { name: 'XOctagon', source: 'lucide', displayName: 'X в восьмиугольнике' },
  { name: 'XSquare', source: 'lucide', displayName: 'X в квадрате' },

  // Замки и безопасность
  { name: 'Lock', source: 'lucide', displayName: 'Замок' },
  { name: 'LockOpen', source: 'lucide', displayName: 'Открытый замок' },
  { name: 'Unlock', source: 'lucide', displayName: 'Разблокировать' },
  { name: 'Key', source: 'lucide', displayName: 'Ключ' },
  { name: 'KeyRound', source: 'lucide', displayName: 'Круглый ключ' },
  { name: 'KeySquare', source: 'lucide', displayName: 'Квадратный ключ' },

  // Награды и достижения
  { name: 'Award', source: 'lucide', displayName: 'Награда' },
  { name: 'Medal', source: 'lucide', displayName: 'Медаль' },
  { name: 'Trophy', source: 'lucide', displayName: 'Кубок' },
  { name: 'Crown', source: 'lucide', displayName: 'Корона' },
  { name: 'Gem', source: 'lucide', displayName: 'Драгоценный камень' },

  // Якоря и морские символы
  { name: 'Anchor', source: 'lucide', displayName: 'Якорь' },

  // Инструменты
  { name: 'Wrench', source: 'lucide', displayName: 'Гаечный ключ' },
  { name: 'Hammer', source: 'lucide', displayName: 'Молоток' },
  { name: 'Drill', source: 'lucide', displayName: 'Дрель' },

  // Музыка
  { name: 'Music', source: 'lucide', displayName: 'Музыка' },
  { name: 'Music2', source: 'lucide', displayName: 'Музыка 2' },
  { name: 'Music3', source: 'lucide', displayName: 'Музыка 3' },
  { name: 'Music4', source: 'lucide', displayName: 'Музыка 4' },

  // Колокольчики
  { name: 'Bell', source: 'lucide', displayName: 'Колокольчик' },
  { name: 'BellRing', source: 'lucide', displayName: 'Звонящий колокольчик' },

  // Часы и время
  { name: 'Clock', source: 'lucide', displayName: 'Часы' },
  { name: 'Watch', source: 'lucide', displayName: 'Наручные часы' },
  { name: 'Timer', source: 'lucide', displayName: 'Таймер' },
  { name: 'Hourglass', source: 'lucide', displayName: 'Песочные часы' },
];

// Кураторская коллекция: Бизнес и офис
const businessIcons: IconInfo[] = [
  // Документы
  { name: 'File', source: 'lucide', displayName: 'Файл' },
  { name: 'FileCheck', source: 'lucide', displayName: 'Проверенный файл' },
  { name: 'FileText', source: 'lucide', displayName: 'Текстовый файл' },
  { name: 'FileCheck2', source: 'lucide', displayName: 'Проверенный файл 2' },
  { name: 'FileBadge', source: 'lucide', displayName: 'Файл со значком' },
  { name: 'FileBadge2', source: 'lucide', displayName: 'Файл со значком 2' },

  // Папки
  { name: 'Folder', source: 'lucide', displayName: 'Папка' },
  { name: 'FolderCheck', source: 'lucide', displayName: 'Проверенная папка' },
  { name: 'FolderOpen', source: 'lucide', displayName: 'Открытая папка' },

  // Печати и подписи
  { name: 'Stamp', source: 'lucide', displayName: 'Штамп' },
  { name: 'Signature', source: 'lucide', displayName: 'Подпись' },

  // Деньги
  { name: 'DollarSign', source: 'lucide', displayName: 'Доллар' },
  { name: 'Euro', source: 'lucide', displayName: 'Евро' },
  { name: 'Coins', source: 'lucide', displayName: 'Монеты' },
  { name: 'Banknote', source: 'lucide', displayName: 'Банкнота' },
  { name: 'Wallet', source: 'lucide', displayName: 'Кошелек' },

  // Бизнес атрибуты
  { name: 'Briefcase', source: 'lucide', displayName: 'Портфель' },
  { name: 'Building', source: 'lucide', displayName: 'Здание' },
  { name: 'Building2', source: 'lucide', displayName: 'Здание 2' },
  { name: 'Store', source: 'lucide', displayName: 'Магазин' },
  { name: 'Landmark', source: 'lucide', displayName: 'Ориентир' },

  // Графики и аналитика
  { name: 'BarChart', source: 'lucide', displayName: 'Столбчатая диаграмма' },
  { name: 'BarChart2', source: 'lucide', displayName: 'Столбчатая диаграмма 2' },
  { name: 'BarChart3', source: 'lucide', displayName: 'Столбчатая диаграмма 3' },
  { name: 'LineChart', source: 'lucide', displayName: 'Линейный график' },
  { name: 'PieChart', source: 'lucide', displayName: 'Круговая диаграмма' },
  { name: 'TrendingUp', source: 'lucide', displayName: 'Рост' },
  { name: 'TrendingDown', source: 'lucide', displayName: 'Падение' },

  // Контакты
  { name: 'Phone', source: 'lucide', displayName: 'Телефон' },
  { name: 'Mail', source: 'lucide', displayName: 'Почта' },
  { name: 'MapPin', source: 'lucide', displayName: 'Метка на карте' },
  { name: 'Map', source: 'lucide', displayName: 'Карта' },

  // Календарь
  { name: 'Calendar', source: 'lucide', displayName: 'Календарь' },
  { name: 'CalendarCheck', source: 'lucide', displayName: 'Календарь с галочкой' },
  { name: 'CalendarClock', source: 'lucide', displayName: 'Календарь с часами' },
];

// Кураторская коллекция: Декоративные элементы
const decorativeIcons: IconInfo[] = [
  // Ленточки и баннеры
  { name: 'Ribbon', source: 'lucide', displayName: 'Лента' },

  // Рамки и границы
  { name: 'BorderAll', source: 'lucide', displayName: 'Все границы' },
  { name: 'BorderTop', source: 'lucide', displayName: 'Верхняя граница' },
  { name: 'BorderBottom', source: 'lucide', displayName: 'Нижняя граница' },
  { name: 'BorderLeft', source: 'lucide', displayName: 'Левая граница' },
  { name: 'BorderRight', source: 'lucide', displayName: 'Правая граница' },

  // Книги и образование
  { name: 'Book', source: 'lucide', displayName: 'Книга' },
  { name: 'BookOpen', source: 'lucide', displayName: 'Открытая книга' },
  { name: 'GraduationCap', source: 'lucide', displayName: 'Академическая шапочка' },

  // Флаги
  { name: 'Flag', source: 'lucide', displayName: 'Флаг' },
  { name: 'FlagTriangleRight', source: 'lucide', displayName: 'Треугольный флаг справа' },
  { name: 'FlagTriangleLeft', source: 'lucide', displayName: 'Треугольный флаг слева' },

  // Подарки
  { name: 'Gift', source: 'lucide', displayName: 'Подарок' },

  // Дом
  { name: 'Home', source: 'lucide', displayName: 'Дом' },

  // Камера и фото
  { name: 'Camera', source: 'lucide', displayName: 'Камера' },
  { name: 'Image', source: 'lucide', displayName: 'Изображение' },

  // Маркеры и закладки
  { name: 'Bookmark', source: 'lucide', displayName: 'Закладка' },
  { name: 'BookmarkCheck', source: 'lucide', displayName: 'Закладка с галочкой' },

  // Булавки
  { name: 'Pin', source: 'lucide', displayName: 'Булавка' },
  { name: 'PinOff', source: 'lucide', displayName: 'Открепить' },

  // Компас и навигация
  { name: 'Compass', source: 'lucide', displayName: 'Компас' },
  { name: 'Navigation', source: 'lucide', displayName: 'Навигация' },

  // Облака
  { name: 'Cloud', source: 'lucide', displayName: 'Облако' },

  // Зонты
  { name: 'Umbrella', source: 'lucide', displayName: 'Зонт' },

  // Воздушные шары
  { name: 'PartyPopper', source: 'lucide', displayName: 'Хлопушка' },
];

// Кураторская коллекция: Значки и бейджи
const badgesIcons: IconInfo[] = [
  // Значки верификации
  { name: 'BadgeCheck', source: 'lucide', displayName: 'Значок с галочкой' },
  { name: 'BadgeAlert', source: 'lucide', displayName: 'Значок с предупреждением' },
  { name: 'BadgeInfo', source: 'lucide', displayName: 'Информационный значок' },
  { name: 'BadgeHelp', source: 'lucide', displayName: 'Значок помощи' },

  // Печати и сертификаты
  { name: 'Verified', source: 'lucide', displayName: 'Верифицирован' },

  // Сердца и лайки
  { name: 'HeartHandshake', source: 'lucide', displayName: 'Сердце с рукопожатием' },

  // Пользователи
  { name: 'User', source: 'lucide', displayName: 'Пользователь' },
  { name: 'UserCheck', source: 'lucide', displayName: 'Проверенный пользователь' },
  { name: 'Users', source: 'lucide', displayName: 'Пользователи' },

  // Медицинские значки
  { name: 'Pill', source: 'lucide', displayName: 'Таблетка' },
  { name: 'Syringe', source: 'lucide', displayName: 'Шприц' },
  { name: 'Stethoscope', source: 'lucide', displayName: 'Стетоскоп' },

  // Транспорт
  { name: 'Car', source: 'lucide', displayName: 'Автомобиль' },
  { name: 'Truck', source: 'lucide', displayName: 'Грузовик' },
  { name: 'Plane', source: 'lucide', displayName: 'Самолет' },
  { name: 'Ship', source: 'lucide', displayName: 'Корабль' },

  // Технологии
  { name: 'Wifi', source: 'lucide', displayName: 'Wi-Fi' },
  { name: 'Bluetooth', source: 'lucide', displayName: 'Bluetooth' },
  { name: 'Radio', source: 'lucide', displayName: 'Радио' },

  // QR коды
  { name: 'QrCode', source: 'lucide', displayName: 'QR код' },
  { name: 'ScanLine', source: 'lucide', displayName: 'Линия сканирования' },
  { name: 'Scan', source: 'lucide', displayName: 'Сканировать' },
];

// Группируем все категории
const iconsByCategory: Record<IconCategory, IconInfo[]> = {
  shapes: shapesIcons,
  stars: starsIcons,
  arrows: arrowsIcons,
  nature: natureIcons,
  symbols: symbolsIcons,
  business: businessIcons,
  decorative: decorativeIcons,
  badges: badgesIcons,
};

// Экспортируем категории
export const categories: { id: IconCategory; name: string; icons: IconInfo[] }[] = [
  { id: 'shapes', name: 'Фигуры', icons: shapesIcons },
  { id: 'stars', name: 'Звезды и снежинки', icons: starsIcons },
  { id: 'arrows', name: 'Стрелки', icons: arrowsIcons },
  { id: 'nature', name: 'Природа', icons: natureIcons },
  { id: 'symbols', name: 'Символы', icons: symbolsIcons },
  { id: 'business', name: 'Бизнес', icons: businessIcons },
  { id: 'decorative', name: 'Декоративные', icons: decorativeIcons },
  { id: 'badges', name: 'Значки', icons: badgesIcons },
];

console.log(`Загружено кураторских иконок: ${categories.reduce((sum, cat) => sum + cat.icons.length, 0)}`);

// Получить иконки по категории
export const getIconsByCategory = (category: IconCategory): IconInfo[] => {
  return iconsByCategory[category] || [];
};

// Поиск иконок по имени (ищет во всех категориях)
export const searchIcons = (query: string): IconInfo[] => {
  const lowerQuery = query.toLowerCase();
  const allIcons = Object.values(iconsByCategory).flat();

  return allIcons.filter(
    (icon) =>
      icon.displayName.toLowerCase().includes(lowerQuery) ||
      icon.name.toLowerCase().includes(lowerQuery)
  );
};

// Экспортируем все иконки
export const getAllIcons = (): IconInfo[] => {
  return Object.values(iconsByCategory).flat();
};

// Экспортируем компоненты иконок для использования в рендере
export { LucideIcons, HeroIcons };
