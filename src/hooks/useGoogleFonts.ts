import { useEffect, useState } from 'react';
import { getGoogleFontsUrl, ALL_FONTS } from '../utils/fonts';

/**
 * Хук для загрузки всех Google Fonts в приложении
 * Создаёт <link> элемент в <head> для загрузки шрифтов из Google Fonts API
 * Также проверяет загрузку шрифтов через Font Loading API
 */
export const useGoogleFonts = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Проверяем, не загружен ли уже
    const existingLink = document.querySelector('link[data-google-fonts]');
    if (existingLink) {
      setLoaded(true);
      return;
    }

    // Создаём link элемент для загрузки Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = getGoogleFontsUrl();
    link.setAttribute('data-google-fonts', 'true');

    // Обработчик успешной загрузки
    link.onload = () => {
      console.log('Google Fonts CSS loaded successfully');

      // Проверяем загрузку шрифтов через Font Loading API (если доступен)
      if ('fonts' in document) {
        // Ждём загрузки основных шрифтов
        Promise.all(
          ALL_FONTS.slice(0, 10).map(font =>
            document.fonts.load(`16px "${font.name}"`).catch(() => {
              console.warn(`Failed to preload font: ${font.name}`);
            })
          )
        ).then(() => {
          console.log('First 10 Google Fonts preloaded');
          setLoaded(true);
        });
      } else {
        // Если Font Loading API недоступен, просто отмечаем как загруженное
        setLoaded(true);
      }
    };

    link.onerror = () => {
      console.error('Failed to load Google Fonts CSS');
      setLoaded(true); // Всё равно продолжаем работу
    };

    // Добавляем в head
    document.head.appendChild(link);

    // Очистка при размонтировании (опционально)
    return () => {
      // Можно оставить шрифты загруженными, т.к. они нужны постоянно
      // link.remove();
    };
  }, []);

  return loaded;
};
