import { useState, useEffect, useMemo } from 'react';
import { convertTextToPath } from '../utils/textToPath';

interface CenteredTextProps {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: string;
  fontStyle: string;
  letterSpacing?: number;
}

// Кэш для векторизованных путей центрированного текста
const centeredTextCache = new Map<string, string>();

// Экспорт функции очистки кэша (может быть полезна для отладки)
export const clearCenteredTextCache = () => {
  centeredTextCache.clear();
};

// Генерирует уникальный ключ для кэширования на основе параметров
const generateCacheKey = (props: CenteredTextProps, scale: number): string => {
  return `${props.text}-${props.x}-${props.y}-${props.fontSize}-${props.fontFamily}-${props.color}-${props.fontWeight}-${props.fontStyle}-${props.letterSpacing || 0}-${scale}`;
};

export const useCenteredTextVectorization = (props: CenteredTextProps, scale: number = 1) => {
  // Деструктурируем props для правильной работы зависимостей
  const { text, x, y, fontSize, fontFamily, color, fontWeight, fontStyle, letterSpacing = 0 } = props;

  const cacheKey = useMemo(
    () => generateCacheKey(props, scale),
    [text, x, y, fontSize, fontFamily, color, fontWeight, fontStyle, letterSpacing, scale]
  );

  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем кэш
    if (centeredTextCache.has(cacheKey)) {
      setSvgContent(centeredTextCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Масштабируем параметры
    const scaledProps = {
      ...props,
      x: props.x * scale,
      y: props.y * scale,
      fontSize: props.fontSize * scale,
      letterSpacing: props.letterSpacing,
    };

    const loadVectorizedText = async () => {
      try {
        const result = await convertTextToPath(
          scaledProps.text,
          scaledProps.x,
          scaledProps.y,
          scaledProps.fontSize,
          scaledProps.fontFamily,
          scaledProps.color,
          scaledProps.fontWeight,
          scaledProps.fontStyle,
          scaledProps.letterSpacing
        );

        // Кэшируем результат
        centeredTextCache.set(cacheKey, result);
        setSvgContent(result);
      } catch (error) {
        console.error('Error loading vectorized centered text:', error);
        setSvgContent('');
      } finally {
        setLoading(false);
      }
    };

    loadVectorizedText();
  }, [cacheKey]);

  return { svgContent, loading };
};
