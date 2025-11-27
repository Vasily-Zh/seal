# Карта проекта - Конструктор печатей и штампов

## Главная навигация

Этот файл содержит структуру проекта и навигацию по всем ключевым файлам.

## Структура проекта

```
src/
├── App.tsx                    # Главный компонент приложения
├── main.tsx                   # Точка входа
├── types/                     # TypeScript типы и интерфейсы
│   └── index.ts              # Экспорт всех типов (+ GroupElement, locked, parentId)
├── store/                     # Управление состоянием
│   └── useStampStore.ts      # Zustand store с undo/redo + слои + группы + проекты
├── components/                # React компоненты
│   ├── Layout/               # Компоненты макета
│   │   └── MainLayout.tsx    # Основной layout 60/40
│   ├── Toolbar/              # Панель инструментов
│   │   └── Toolbar.tsx       # Добавление элементов
│   ├── Controls/             # Панель настроек
│   │   ├── Controls.tsx      # Табы: Настройки / Слои
│   │   ├── LayersPanel.tsx   # Панель слоёв с DnD, группировкой, блокировкой
│   │   ├── SliderInput.tsx   # Ползунок с числовым полем
│   │   └── FontSelector.tsx  # Компонент выбора шрифтов с группировкой вариантов
│   ├── Canvas/               # Рабочая область
│   │   ├── Canvas.tsx        # SVG canvas с сеткой + GroupElement
│   │   └── elements/         # Рендеринг элементов
│   │       ├── CircleElement.tsx
│   │       ├── TextElement.tsx
│   │       └── GroupElement.tsx  # Рендеринг групп с трансформациями
│   ├── ProjectManager/       # Управление проектами
│   │   └── ProjectManager.tsx # Модальное окно со списком проектов
│   └── Header/               # Шапка приложения
│       └── Header.tsx        # Кнопки undo/redo/export/save/load
├── utils/                     # Утилиты
│   ├── export.ts             # Экспорт PNG/SVG + exportElementToSVG
│   ├── projectStorage.ts     # Сохранение/загрузка проектов в localStorage
│   ├── svgOptimizer.ts       # Оптимизация SVG (встроенный алгоритм)
│   ├── svgValidator.ts       # Валидация SVG
│   ├── vectorize.ts          # Векторизация изображений (только Potrace WASM)
│   ├── textToPath.ts         # Конвертация текста в SVG path через fontkit
│   ├── fonts.ts              # Конфигурация шрифтов (все доступные шрифты)
│   ├── extractSvgFromIcon.ts # Извлечение SVG из иконок
│   └── auth.ts               # Аутентификация
└── styles/                    # Стили
    └── globals.css           # Глобальные стили

public/
└── fonts/                     # Шрифты (устаревшая директория, не используется)

map/
├── main.md                    # Главная навигация проекта
└── log/                       # Логи изменений
    ├── update-20250123-1430.md # Лог реализации ТЗ
    ├── update-20250124-final.md # Экспорт элементов, Potrace векторизация
    ├── update-20251123-1944.md # Удаление локальных шрифтов
    ├── update-20251123-1945.md # Обновление шрифтов
    ├── update-20251124-2258.md # Расширенный выбор шрифтов
    └── update-20251124-remove-imagetracer.md # Удаление ImageTracer
```

## Ключевые файлы по функционалу

### 1. Типы данных (types/index.ts)
- `StampElement` - базовый интерфейс элемента
- `CircleElement`, `TextElement`, `IconElement`, `GroupElement` - типы элементов
- `BaseElement` - расширен полями: `locked?`, `parentId?`
- `GroupElement` - группа: `name`, `children[]`, `expanded?`, `rotation?`, `scaleX?`, `scaleY?`
- `StampStore` - тип store
- `StampProject` - интерфейс проекта (id, name, elements, canvasSize, timestamps, thumbnail)
- `FontConfig` - интерфейс конфигурации шрифта (name, family, category, isPrintingFont)

### 2. Store (store/useStampStore.ts)
**Управление элементами:**
- `addElement()`, `removeElement()`, `updateElement()`, `selectElement()`
- `centerElement()` - центрирование элемента

**История изменений:**
- `undo()`, `redo()`, `canUndo()`, `canRedo()`, `saveToHistory()`

**Управление слоями (z-index):**
- `moveElementUp(id)` - переместить выше
- `moveElementDown(id)` - переместить ниже
- `moveToTop(id)` - на передний план
- `moveToBottom(id)` - на задний план
- `reorderElements(ids[])` - установить новый порядок

**Группировка элементов:**
- `createGroup(ids[], name?)` - создать группу
- `ungroupElements(groupId)` - разгруппировать
- `addToGroup(groupId, ids[])` - добавить в группу
- `removeFromGroup(groupId, ids[])` - удалить из группы
- `expandGroup(groupId, expanded)` - раскрыть/свернуть в UI

**Блокировка:**
- `toggleElementLock(id)` - заблокировать/разблокировать элемент

**Управление проектами:**
- `loadProjectData(project)` - загрузить проект
- `setCurrentProject(id, name)` - установить текущий проект
- `clearCanvas()` - очистить холст

### 3. Компоненты
- **MainLayout** - разметка 60/40 без скролла
- **Toolbar** - кнопки добавления элементов
- **Controls** - табы "Настройки" / "Слои"
- **LayersPanel** - панель слоёв с drag-and-drop (@dnd-kit):
  - Иерархическое отображение групп
  - Кнопки управления порядком элементов
  - Блокировка/видимость элементов
  - Множественный выбор для группировки
- **SliderInput** - ползунок + поле ввода + стрелочки
- **FontSelector** - компонент выбора шрифтов с группировкой и вариантами
- **Canvas** - SVG рендеринг с сеткой, фильтрация элементов без parentId
- **GroupElement** - рендеринг групп:
  - Рекурсивное отображение вложенных групп
  - Применение трансформаций (rotation, scale)
  - Визуальная рамка при выборе
- **ProjectManager** - модальное окно:
  - Список сохранённых проектов с превью
  - Поиск проектов
  - Кнопки: Открыть, Экспорт, Удалить
  - Импорт из .json файла
- **Header** - кнопки действий:
  - Undo/Redo
  - Сохранить проект (с генерацией превью)
  - Проекты (открывает ProjectManager)
  - Экспорт PNG/SVG

### 4. Утилиты

**export.ts:**
- `exportToPNG()` - сохранение всего холста в PNG
- `exportToPNGTransparent()` - сохранение в PNG с прозрачным фоном
- `exportToSVG()` - сохранение всего холста в SVG
- `exportElementToSVG(element, filename?)` - экспорт отдельного элемента:
  - Поддержка типов: icon, circle, rectangle
  - Применение стилей (fill, stroke)
  - Автоматическая оптимизация через встроенный алгоритм
- `exportToPDF()` - сохранение в PDF
- `exportToZIP()` - экспорт всех форматов в ZIP архив

**projectStorage.ts:**
- `saveProject(name, elements, canvasSize, id?, thumbnail?)` - сохранить проект
- `loadProject(id)` - загрузить проект по ID
- `listProjects()` - список всех проектов
- `deleteProject(id)` - удалить проект
- `exportProjectAsJSON(id)` - экспорт в .json файл
- `importProjectFromJSON(file)` - импорт из файла
- `generateThumbnail(svgElement)` - создание превью 200x200px
- `getStorageSize()`, `checkStorageAvailable()` - утилиты хранилища

**svgOptimizer.ts:**
- `optimizeSVG(svgString, options)` - оптимизация SVG через встроенный алгоритм:
  - Параметры: precision, removeComments
  - Удаление комментариев
  - Округление чисел до заданной точности
  - Удаление лишних пробелов и переносов строк
- `getOptimizationStats(original, optimized)` - статистика оптимизации
- `optimizeSVGWithStats(svgString, options)` - оптимизация + статистика

**vectorize.ts:**
- `vectorizeWithPotrace(imageData, options)` - векторизация через Potrace WASM:
  - Параметры: threshold, turdSize, optCurve, color
- `isImageSuitableForPotrace(imageData)` - определение подходящести изображения для Potrace
- `loadImageAsBase64(file)` - загрузка изображения в base64
- `getImageDimensions(imageSrc)` - получение размеров изображения

**textToPath.ts:**
- `convertTextToPath(text, x, y, fontSize, fontFamily, color, fontWeight, fontStyle)` - конвертация текста в SVG path через fontkit
- `convertCurvedTextToPath(text, cx, cy, radius, fontSize, fontFamily, color, ...)` - конвертация кривого текста в SVG path
- `preloadFont(fontFamily, fontWeight, fontStyle)` - предзагрузка шрифта
- `clearFontCache()` - очистка кэша шрифтов

## Используемые библиотеки

- React 19 + TypeScript
- Vite - сборщик
- Zustand - state management
- lucide-react, @heroicons/react - иконки
- Google Fonts API - шрифты
- **@dnd-kit/core**, **@dnd-kit/sortable**, **@dnd-kit/utilities** - drag-and-drop для слоёв
- **fontkit** - обработка шрифтов и конвертация текста в path (заменен opentype.js)
- **svgpath** - преобразование SVG path
- **esm-potrace-wasm** - векторизация растровых изображений (Potrace только)
- **jsPDF** - генерация PDF
- **jszip** - создание ZIP архивов

## Параметры по умолчанию

- Размер поля: 100мм
- Диаметр круга: 39мм
- Размер текста: 6мм
- Обводка: 3мм

## Шрифты

### Системные шрифты:
- Arial, Arial Narrow, Helvetica, Times New Roman, Georgia, Verdana, Tahoma,
- Trebuchet MS, Impact, Comic Sans MS, Calibri, Cambria, Candara, Carlito,
- DejaVu Sans, Baskerville, Bodoni, Didot, Franklin Gothic, Garamond,
- Microsoft Sans Serif, Monotype Corsiva, Sylfaen, Ubuntu

### Google Fonts:
- Alex Brush, Anton, Archivo, Baloo 2, Bebas Neue, Bodoni Moda, Caveat, Commissioner,
- Comic Neue, Cormorant Garamond, Crimson Pro, Dancing Script, EB Garamond,
- Fira Code, Fira Sans, Fredoka, Great Vibes, IBM Plex Sans, IBM Plex Serif,
- Inter, Karla, Kaushan Script, League Gothic, Libre Baskerville, Literata,
- Manrope, Merriweather, Mulish, Noto Sans, Noto Serif, Nunito, Open Sans,
- Oswald, Parisienne, Playfair Display, Poppins, PT Sans, PT Serif, Public Sans,
- Roboto, Sacramento, Satisfy, Source Serif 4, Tangerine

### Используемая технология:
- fontkit для конвертации текста в SVG path
- Прямая загрузка шрифтов из Google Fonts API с поддержкой кириллицы
- Кэширование загруженных шрифтов для производительности
- Система fallback-шрифтов для обработки системных шрифтов

---

## Новые возможности (2025)

### ✅ Слои и группировка элементов
- Drag-and-drop переупорядочивание элементов
- Создание/удаление групп элементов
- Вложенные группы с трансформациями
- Блокировка элементов от редактирования
- Управление видимостью элементов
- Кнопки быстрого управления порядком (вперёд/назад/на передний план/на задний план)

### ✅ Сохранение и управление проектами
- Сохранение проектов в localStorage (до 10MB)
- Автоматическая генерация превью 200x200px
- Менеджер проектов с поиском и фильтрацией
- Экспорт/импорт проектов в JSON
- Информация о размере и дате последнего изменения

### ✅ SVG оптимизация
- Автоматическая оптимизация при экспорте через встроенный алгоритм
- Настройки точности округления
- Удаление комментариев
- Оптимизация путей и форм
- Статистика оптимизации (размер до/после)

### ✅ Экспорт отдельных элементов
- Экспорт индивидуальных элементов в SVG
- Поддержка иконок (lucide, heroicons, custom)
- Поддержка примитивов (круг, прямоугольник, текст)
- Применение стилей (fill, stroke, strokeWidth)
- Автоматическая оптимизация экспортируемых файлов
- **UI кнопка "Экспорт SVG" в Controls для IconElement**

### ✅ Potrace векторизация (январь 2025)
- Диалоговое окно VectorizationDialog с настройками Potrace
- **Potrace WASM** - для черно-белых логотипов (настройки: порог, фильтр деталей, цвет)
- Автоопределение подходящести изображения для Potrace
- Превью загруженного изображения

### ✅ Обновленная система шрифтов (ноябрь 2025)
- Заменен opentype.js на fontkit для лучшей обработки шрифтов
- Поддержка кириллических символов
- 50+ доступных шрифтов (системные + Google Fonts)
- Расширенный компонент FontSelector с группировкой
- Кэширование загруженных шрифтов
- Система fallback-шрифтов

### ✅ Удаление ImageTracer (ноябрь 2025)
- Полное удаление библиотеки imagetracerjs
- Оставлен только Potrace WASM как метод векторизации
- Упрощение интерфейса векторизации

---

## Логи изменений

Подробные логи всех изменений находятся в: `map/log/`

- **update-20250123-1430.md** - Реализация слоёв, групп, сохранения проектов, SVG оптимизации
- **update-20250124-final.md** - Кнопка экспорта элементов, Potrace векторизация, VectorizationDialog
- **update-20251123-1944.md** - Удаление локальных шрифтов, переход на fontkit
- **update-20251123-1945.md** - Обновление шрифтов в документации
- **update-20251124-2258.md** - Расширенный выбор шрифтов с группировкой
- **update-20251124-remove-imagetracer.md** - Удаление ImageTracer из проекта
