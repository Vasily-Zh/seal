# Store - Управление состоянием

Zustand store для управления элементами печати с историей изменений.

## Ключевые файлы
- [useStampStore.ts](src/store/useStampStore.ts) - Основной store

## Основные методы
- [addElement](src/store/useStampStore.ts:78) - Добавление элемента
- [updateElement](src/store/useStampStore.ts:99) - Обновление элемента
- [removeElement](src/store/useStampStore.ts:90) - Удаление элемента
- [undo](src/store/useStampStore.ts:139) - Отмена действия
- [redo](src/store/useStampStore.ts:154) - Повтор действия
- [saveToHistory](src/store/useStampStore.ts:121) - Сохранение в историю
- [centerElement](src/store/useStampStore.ts:181) - Центрирование элемента