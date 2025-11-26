# Шрифты в проекте "Конструктор печатей и штампов"

## 📊 Общая статистика
- **Google Fonts (CDN):** 44 шрифта
- **Google Fonts (локально):** 60 файлов (могут быть нерабочими)
- **Системные шрифты (локально):** 16 файлов  
- **Локальные шрифты (src/assets):** 1 файл
- **Всего файлов:** 77 файлов

---

## 🌐 Google Fonts (через CDN в index.html)
Подключены через Google Fonts API - **РАБОТАЮТ КОРРЕКТНО**

1. Alex Brush
2. Anton
3. Archivo
4. Baloo 2
5. Bebas Neue
6. Bodoni Moda
7. Caveat
8. Commissioner
9. Comic Neue
10. Cormorant Garamond
11. Crimson Pro
12. Dancing Script
13. EB Garamond
14. Fira Code
15. Fira Sans
16. Fredoka
17. Great Vibes
18. IBM Plex Sans
19. IBM Plex Serif
20. Inter
21. Karla
22. Kaushan Script
23. League Gothic
24. Libre Baskerville
25. Literata
26. Manrope
27. Merriweather
28. Mulish
29. Noto Sans
30. Noto Serif
31. Nunito
32. Open Sans
33. Oswald
34. Parisienne
35. Playfair Display
36. Poppins
37. PT Sans
38. PT Serif
39. Public Sans
40. Roboto
41. Sacramento
42. Satisfy
43. Source Serif 4
44. Tangerine

---

## 📁 Google Fonts (локальные файлы)
**Путь:** `public/fonts/google-fonts/`

### ❗ ПРОБЛЕМА: Большинство файлов нерабочие
Скрипт `download-fonts.js` скачивает только **2 шрифта** (Roboto), остальные 60 файлов добавлены другим способом.

**Файлы шрифтов:**
- alexbrush-regular.ttf
- anton-regular.ttf
- archivo-bold.ttf
- archivo-regular.ttf
- baloo2-bold.ttf
- baloo2-regular.ttf
- bebasneue-regular.ttf
- bodonimoda-regular.ttf
- caveat-bold.ttf
- caveat-regular.ttf
- commissioner-regular.ttf
- cormorantgaramond-regular.ttf
- crimsonpro-regular.ttf
- dancingscript-bold.ttf
- dancingscript-regular.ttf
- ebgaramond-regular.ttf
- firacode-regular.ttf
- firasans-bold.ttf
- firasans-regular.ttf
- fredoka-regular.ttf
- greatvibes-regular.ttf
- ibmplexsans-bold.ttf
- ibmplexsans-regular.ttf
- ibmplexserif-bold.ttf
- ibmplexserif-regular.ttf
- inter-regular.ttf
- karla-bold.ttf
- karla-regular.ttf
- kaushanscript-regular.ttf
- leaguegothic-regular.ttf
- librebaskerville-regular.ttf
- literata-regular.ttf
- manrope-bold.ttf
- manrope-regular.ttf
- merriweather-bold.ttf
- merriweather-regular.ttf
- mulish-bold.ttf
- mulish-regular.ttf
- notosans-bold.ttf
- notosans-regular.ttf
- notoserif-bold.ttf
- notoserif-regular.ttf
- nunito-bold.ttf
- nunito-regular.ttf
- opensans-bold.ttf
- opensans-regular.ttf
- oswald-bold.ttf
- oswald-regular.ttf
- parisienne-regular.ttf
- playfairdisplay-bold.ttf
- playfairdisplay-regular.ttf
- poppins-bold.ttf
- poppins-regular.ttf
- ptsans-bold.ttf
- ptsans-regular.ttf
- ptserif-bold.ttf
- ptserif-regular.ttf
- publicsans-bold.ttf
- publicsans-regular.ttf
- roboto-bold.ttf ✅ (скачан скриптом)
- roboto-regular.ttf ✅ (скачан скриптом)
- sacramento-regular.ttf
- satisfy-regular.ttf
- sourceserif4-bold.ttf
- sourceserif4-regular.ttf
- tangerine-regular.ttf
- ubuntu-bold.ttf
- ubuntu-regular.ttf

---

## 💻 Системные шрифты (локальные)
**Путь:** `public/fonts/system-fonts/`

### Файлы:
- arial-bold.ttf
- arial-regular.ttf
- comic-bold.ttf
- comic-regular.ttf
- comicneue-bold.ttf
- comicneue-regular.ttf
- courier-regular.ttf
- georgia-bold.ttf
- georgia-regular.ttf
- impact-regular.ttf
- tahoma-bold.ttf
- tahoma-regular.ttf
- test.ttf
- times-bold.ttf
- times-regular.ttf
- verdana-bold.ttf
- verdana-regular.ttf

### ❓ Статус: Неизвестно
Эти шрифты могли быть добавлены вручную или скопированы из системы.

---

## 🗂️ Локальные шрифты (src/assets)
**Путь:** `src/assets/fonts/`

- roboto-regular.ttf ✅ (используется в fontImports.ts)

---

## 🚨 Критические проблемы

### 1. Несоответствие скрипта и файлов
- `scripts/download-fonts.js` скачивает только 2 шрифта
- В папке `public/fonts/google-fonts/` находится 60+ файлов
- **Большинство локальных файлов шрифтов нерабочие**

### 2. Ошибка в fontImports.ts
```typescript
import robotoBoldUrl from '../assets/fonts/roboto-regular.ttf'; // ❌ ОШИБКА!
```

### 3. Неработающая система fontUrls
```typescript
export const fontUrls = {
  'Roboto': { 'normal-normal': url1, 'bold-normal': url2 }, // Только Roboto
  // Остальные 43 Google Fonts отсутствуют!
};
```

---

## ✅ Что работает

1. **Google Fonts через CDN** - все 44 шрифта подключены и работают
2. **Визуальное отображение** - шрифты применяются корректно в интерфейсе
3. **FontSelector** - показывает все шрифты из ALL_FONTS

---

## ⚠️ Что НЕ работает

1. **Векторизация текста** - может не найти файлы шрифтов
2. **Экспорт с локальными шрифтами** - неопределенность с источником
3. **Система fontUrls** - покрывает только Roboto

---

## 💡 Рекомендуемые решения

### Вариант 1: Только Google Fonts CDN
- Удалить все локальные шрифты кроме Roboto
- Использовать только CDN для рендеринга
- Переписать векторизацию под CDN

### Вариант 2: Пересоздать систему
- Обновить `download-fonts.js` для скачивания всех 44 шрифтов
- Пересоздать `fontUrls` карту
- Исправить ошибки в `fontImports.ts`

### Вариант 3: Гибридный подход
- CDN для рендеринга
- Локальные файлы только для векторизации
- Система проверки доступности шрифтов