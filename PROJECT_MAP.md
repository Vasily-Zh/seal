# Карта проекта - Конструктор печатей и штампов

## Главная навигация

Этот файл содержит структуру проекта и навигацию по всем ключевым файлам.

## Структура проекта

```
src/
├── App.tsx                    # Главный компонент приложения
├── main.tsx                   # Точка входа
├── types/                     # TypeScript типы и интерфейсы
│   └── index.ts              # Экспорт всех типов
├── store/                     # Управление состоянием
│   └── useStampStore.ts      # Zustand store с undo/redo
├── components/                # React компоненты
│   ├── Layout/               # Компоненты макета
│   │   └── MainLayout.tsx    # Основной layout 60/40
│   ├── Toolbar/              # Панель инструментов
│   │   └── Toolbar.tsx       # Добавление элементов
│   ├── Controls/             # Панель настроек
│   │   ├── Controls.tsx      # Список элементов + настройки
│   │   └── SliderInput.tsx   # Ползунок с числовым полем
│   ├── Canvas/               # Рабочая область
│   │   ├── Canvas.tsx        # SVG canvas с сеткой
│   │   └── elements/         # Рендеринг элементов
│   │       ├── CircleElement.tsx
│   │       └── TextElement.tsx
│   └── Header/               # Шапка приложения
│       └── Header.tsx        # Кнопки undo/redo/export
├── utils/                     # Утилиты
│   ├── export.ts             # Экспорт PNG/SVG
│   └── fonts.ts              # Конфигурация шрифтов
└── styles/                    # Стили
    └── globals.css           # Глобальные стили

public/
└── fonts/                     # Шрифты
```

## Ключевые файлы по функционалу

### 1. Типы данных (types/index.ts)
- `StampElement` - базовый интерфейс элемента
- `CircleElement`, `TextElement` - типы элементов
- `StampStore` - тип store

### 2. Store (store/useStampStore.ts)
- Управление элементами
- История изменений (undo/redo)
- Методы добавления/удаления/обновления элементов

### 3. Компоненты
- **MainLayout** - разметка 60/40 без скролла
- **Toolbar** - кнопки добавления элементов
- **Controls** - список элементов + настройки выбранного
- **SliderInput** - ползунок + поле ввода + стрелочки
- **Canvas** - SVG рендеринг с сеткой и элементами
- **Header** - кнопки действий (undo/redo/export)

### 4. Экспорт (utils/export.ts)
- `exportToPNG()` - сохранение в PNG
- `exportToSVG()` - сохранение в SVG

## Используемые библиотеки

- React 19 + TypeScript
- Vite - сборщик
- Zustand - state management (будет добавлена)
- lucide-react - иконки
- Google Fonts API - шрифты

## Параметры по умолчанию

- Размер поля: 100мм
- Диаметр круга: 39мм
- Размер текста: 6мм
- Обводка: 3мм

## Шрифты

### С засечками (Serif):
1. Times New Roman

### Без засечек (Sans-serif):
1. Arial
2. Roboto
3. Open Sans
4. Ubuntu
