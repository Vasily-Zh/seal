import type { ImageElement as ImageType } from '../../../types';

interface ImageElementProps {
  element: ImageType;
  scale: number;
}

export const ImageElement = ({ element, scale }: ImageElementProps) => {
  if (!element.visible) return null;

  return (
    <image
      x={(element.x - element.width / 2) * scale}
      y={(element.y - element.height / 2) * scale}
      width={element.width * scale}
      height={element.height * scale}
      href={element.src}
      preserveAspectRatio="xMidYMid slice"
    />
  );
};
