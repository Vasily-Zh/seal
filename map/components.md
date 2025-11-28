# Компоненты

Раздел содержит React компоненты для интерфейса конструктора печатей.

## Подразделы
- Layout: [MainLayout](src/components/Layout/MainLayout.tsx) - Основной layout 60/40
- Toolbar: [Toolbar](src/components/Toolbar/Toolbar.tsx) - Панель инструментов для добавления элементов
- Controls: [Controls](src/components/Controls/Controls.tsx) - Настройки элементов, [SliderInput](src/components/Controls/SliderInput.tsx) - Ползунок, [FontSelector](src/components/Controls/FontSelector.tsx) - Выбор шрифта
- Canvas: [Canvas](src/components/Canvas/Canvas.tsx) - SVG холст, elements/ - рендеринг элементов ([CircleElement](src/components/Canvas/elements/CircleElement.tsx), [TextElement](src/components/Canvas/elements/TextElement.tsx), [TextCenteredElement](src/components/Canvas/elements/TextCenteredElement.tsx), etc.)
- Header: [Header](src/components/Header/Header.tsx) - Кнопки действий (undo/redo/export)
- Admin: [AdminPanel](src/components/Admin/AdminPanel.tsx), [AdminLoginModal](src/components/Admin/AdminLoginModal.tsx) - Админка
- Hooks: [useCurvedTextVectorization](src/hooks/useCurvedTextVectorization.ts) - Векторизация кривого текста, [useCenteredTextVectorization](src/hooks/useCenteredTextVectorization.ts) - Векторизация центрированного текста

## Ключевые функции
- [MainLayout](src/components/Layout/MainLayout.tsx) - Разметка интерфейса
- [Canvas](src/components/Canvas/Canvas.tsx) - Рендеринг элементов на SVG
- [Toolbar](src/components/Toolbar/Toolbar.tsx) - Добавление новых элементов
- [TextElement](src/components/Canvas/elements/TextElement.tsx) - Векторизованный текст по кругу (useCurvedTextVectorization)
- [TextCenteredElement](src/components/Canvas/elements/TextCenteredElement.tsx) - Векторизованный центрированный текст (useCenteredTextVectorization)