# Навигация по проекту - Конструктор печатей

## Структура проекта
- [components](components.md) - React компоненты (Layout, Toolbar, Canvas, etc.)
- [store](store.md) - Управление состоянием (Zustand)
- [types](types.md) - TypeScript типы и интерфейсы
- [utils](utils.md) - Утилиты (экспорт, шрифты, валидация)
- [data](data.md) - Данные (иконки, коллекции)
- [styles](styles.md) - Стили CSS
- [scripts](scripts.md) - Скрипты сборки
- [config](config.md) - Конфигурационные файлы

## Ключевые точки входа
- [src/main.tsx](src/main.tsx:6) - Точка входа приложения
- [src/App.tsx](src/App.tsx:4) - Главный компонент
- [src/store/useStampStore.ts](src/store/useStampStore.ts:69) - Store с undo/redo