# Конфигурации

Файлы конфигурации для TypeScript, ESLint, Vite.

## Ключевые файлы
- [package.json](package.json) - Зависимости (React 19, Vite, Zustand, Lucide/Heroicons, fontkit, potrace-wasm) и скрипты (dev, build, lint)
- [tsconfig.json](tsconfig.json) - TypeScript конфиг (ссылки на app.json и node.json)
- [vite.config.ts](vite.config.ts) - Vite конфиг с React plugin
- [eslint.config.js](eslint.config.js) - ESLint конфиг (recommended + React hooks + refresh)

## Основные зависимости
- **React 19.2.0** - Библиотека для построения интерфейсов
- **TypeScript 5.9.3** - Язык программирования с типизацией
- **Vite 7.2.4** - Сборщик и сервер разработки
- **Zustand 5.0.8** - Библиотека управления состоянием
- **fontkit 2.0.4** - Обработка шрифтов и конвертация текста в path (замена opentype.js)
- **esm-potrace-wasm 0.4.1** - Векторизация изображений (Potrace)
- **jsPDF 3.0.4** - Генерация PDF
- **jszip 3.10.1** - Создание ZIP архивов
- **svgpath 2.6.0** - Преобразование SVG path
- **@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities** - Drag-and-drop функциональность
- **lucide-react, @heroicons/react** - Библиотеки иконок