// Экспорт в PNG
export const exportToPNG = (svgElement: SVGSVGElement | null, filename: string = 'stamp.png') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  // Клонируем SVG
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Создаем Blob из SVG
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Создаем изображение
  const img = new Image();
  img.onload = () => {
    // Создаем canvas
    const canvas = document.createElement('canvas');
    canvas.width = svgElement.clientWidth * 2; // Увеличиваем для лучшего качества
    canvas.height = svgElement.clientHeight * 2;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Белый фон
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем изображение
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Конвертируем в PNG и скачиваем
    canvas.toBlob((blob) => {
      if (!blob) return;
      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(pngUrl);
    }, 'image/png');

    URL.revokeObjectURL(url);
  };

  img.src = url;
};

// Экспорт в SVG
export const exportToSVG = (svgElement: SVGSVGElement | null, filename: string = 'stamp.svg') => {
  if (!svgElement) {
    console.error('SVG element not found');
    return;
  }

  // Клонируем SVG
  const svgClone = svgElement.cloneNode(true) as SVGSVGElement;

  // Добавляем XML namespace если его нет
  if (!svgClone.getAttribute('xmlns')) {
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }

  // Сериализуем SVG
  const svgString = new XMLSerializer().serializeToString(svgClone);

  // Создаем Blob
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Скачиваем
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};
