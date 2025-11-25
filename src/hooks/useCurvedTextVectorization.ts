import { useState, useEffect, useMemo } from 'react';
import { convertCurvedTextToPath } from '../utils/textToPath';

interface CurvedTextProps {
  text: string;
  cx: number;
  cy: number;
  radius: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  startAngle: number;
  isFlipped: boolean;
  fontWeight: string;
  fontStyle: string;
}

// Кэш для векторизованных путей кругового текста
const curvedTextCache = new Map<string, string>();

// Генерирует уникальный ключ для кэширования на основе параметров
const generateCacheKey = (props: CurvedTextProps, scale: number): string => {
  return `${props.text}-${props.cx}-${props.cy}-${props.radius}-${props.fontSize}-${props.fontFamily}-${props.color}-${props.startAngle}-${props.isFlipped}-${props.fontWeight}-${props.fontStyle}-${scale}`;
};

export const useCurvedTextVectorization = (props: CurvedTextProps, scale: number = 1) => {
  const cacheKey = useMemo(() => generateCacheKey(props, scale), [props, scale]);

  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем кэш
    if (curvedTextCache.has(cacheKey)) {
      setSvgContent(curvedTextCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Масштабируем параметры
    const scaledProps = {
      ...props,
      cx: props.cx * scale,
      cy: props.cy * scale,
      radius: props.radius * scale,
      fontSize: props.fontSize * scale,
    };

    const loadVectorizedText = async () => {
      try {
        const result = await convertCurvedTextToPath(
          scaledProps.text,
          scaledProps.cx,
          scaledProps.cy,
          scaledProps.radius,
          scaledProps.fontSize,
          scaledProps.fontFamily,
          scaledProps.color,
          scaledProps.startAngle,
          scaledProps.isFlipped,
          scaledProps.fontWeight,
          scaledProps.fontStyle
        );

        // Кэшируем результат
        curvedTextCache.set(cacheKey, result);
        setSvgContent(result);
      } catch (error) {
        console.error('Error loading vectorized curved text:', error);
        setSvgContent('');
      } finally {
        setLoading(false);
      }
    };

    loadVectorizedText();
  }, [cacheKey]); // Теперь используем cacheKey как зависимость

  return { svgContent, loading };
};