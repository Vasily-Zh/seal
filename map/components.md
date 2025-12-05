# Компоненты

Раздел содержит React компоненты для интерфейса конструктора печатей.

## Подразделы
- Layout: [MainLayout](src/components/Layout/MainLayout.tsx) - Основной layout 60/40
- Toolbar: [Toolbar](src/components/Toolbar/Toolbar.tsx) - Панель инструментов для добавления элементов
- Controls: [Controls](src/components/Controls/Controls.tsx) - Настройки элементов, [SliderInput](src/components/Controls/SliderInput.tsx) - Ползунок, [FontSelector](src/components/Controls/FontSelector.tsx) - Выбор шрифта, [LayersPanel](src/components/Controls/LayersPanel.tsx) - Панель слоёв с drag-and-drop, [MobileLayersPanel](src/components/Controls/MobileLayersPanel.tsx) - Мобильная панель слоёв
- Canvas: [Canvas](src/components/Canvas/Canvas.tsx) - SVG холст, elements/ - рендеринг элементов ([CircleElement](src/components/Canvas/elements/CircleElement.tsx), [TextElement](src/components/Canvas/elements/TextElement.tsx), [TextCenteredElement](src/components/Canvas/elements/TextCenteredElement.tsx), etc.)
- Templates: [TemplateCategoryBar](src/components/Templates/TemplateCategoryBar.tsx) - Панель категорий шаблонов, [TemplateGalleryPage](src/components/Templates/TemplateGalleryPage.tsx) - Галерея шаблонов, [TemplatePreview](src/components/Templates/TemplatePreview.tsx) - Превью шаблона, [GeneratorPage](src/components/Templates/GeneratorPage.tsx) - Страница генератора с поиском иконок
- Header: [Header](src/components/Header/Header.tsx) - Кнопки действий (undo/redo/export)
- Admin: [AdminPanel](src/components/Admin/AdminPanel.tsx), [AdminLoginModal](src/components/Admin/AdminLoginModal.tsx), [AdminTemplatesTab](src/components/Admin/AdminTemplatesTab.tsx) - Админка и управление шаблонами
- Hooks: [useCurvedTextVectorization](src/hooks/useCurvedTextVectorization.ts) - Векторизация кривого текста, [useCenteredTextVectorization](src/hooks/useCenteredTextVectorization.ts) - Векторизация центрированного текста

## Ключевые функции
- [MainLayout](src/components/Layout/MainLayout.tsx) - Разметка интерфейса
- [Canvas](src/components/Canvas/Canvas.tsx) - Рендеринг элементов на SVG
- [Toolbar](src/components/Toolbar/Toolbar.tsx) - Добавление новых элементов
- [TextElement](src/components/Canvas/elements/TextElement.tsx) - Векторизованный текст по кругу (useCurvedTextVectorization)
- [TextCenteredElement](src/components/Canvas/elements/TextCenteredElement.tsx) - Векторизованный центрированный текст (useCenteredTextVectorization)
- [GeneratorPage](src/components/Templates/GeneratorPage.tsx) - Генератор печатей с поиском по ключевым словам
- [AdminTemplatesTab](src/components/Admin/AdminTemplatesTab.tsx) - Управление шаблонами и базовыми шаблонами для генератора