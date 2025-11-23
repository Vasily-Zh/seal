# Компоненты

Раздел содержит React компоненты для интерфейса конструктора печатей.

## Подразделы
- Layout: [MainLayout](src/components/Layout/MainLayout.tsx) - Основной layout 60/40
- Toolbar: [Toolbar](src/components/Toolbar/Toolbar.tsx) - Панель инструментов для добавления элементов
- Controls: [Controls](src/components/Controls/Controls.tsx) - Настройки элементов, [SliderInput](src/components/Controls/SliderInput.tsx) - Ползунок
- Canvas: [Canvas](src/components/Canvas/Canvas.tsx) - SVG холст, elements/ - рендеринг элементов ([CircleElement](src/components/Canvas/elements/CircleElement.tsx), [TextElement](src/components/Canvas/elements/TextElement.tsx), etc.)
- Header: [Header](src/components/Header/Header.tsx) - Кнопки действий (undo/redo/export)
- Admin: [AdminPanel](src/components/Admin/AdminPanel.tsx), [AdminLoginModal](src/components/Admin/AdminLoginModal.tsx) - Админка

## Ключевые функции
- [MainLayout](src/components/Layout/MainLayout.tsx) - Разметка интерфейса
- [Canvas](src/components/Canvas/Canvas.tsx) - Рендеринг элементов на SVG
- [Toolbar](src/components/Toolbar/Toolbar.tsx) - Добавление новых элементов