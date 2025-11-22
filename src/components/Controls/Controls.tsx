import { Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { SliderInput } from './SliderInput';
import { ALL_FONTS } from '../../utils/fonts';
import type { CircleElement as CircleElementType, TextElement as TextElementType, TextCenteredElement as TextCenteredElementType, RectangleElement as RectangleElementType, ImageElement as ImageElementType, IconElement as IconElementType } from '../../types';
import { IconGalleryModal } from '../Toolbar/IconGalleryModal';
import { vectorizeImage } from '../../utils/vectorize';
import { applySvgStyles } from '../../utils/extractSvgFromIcon';

interface ControlsProps {
  showOnlyElements?: boolean;
  showOnlySettings?: boolean;
}

export const Controls = ({ showOnlyElements = false, showOnlySettings = false }: ControlsProps) => {
  const elements = useStampStore((state) => state.elements);
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const updateElement = useStampStore((state) => state.updateElement);
  const removeElement = useStampStore((state) => state.removeElement);
  const selectElement = useStampStore((state) => state.selectElement);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  // Если показываем только список элементов
  if (showOnlyElements) {
    return (
      <div>
        {elements.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Элементов пока нет</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {elements.map((element) => (
              <div
                key={element.id}
                onClick={() => selectElement(element.id)}
                style={{
                  padding: '12px',
                  border: selectedElementId === element.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedElementId === element.id ? '#eff6ff' : '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GripVertical size={16} color="#9ca3af" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {element.type === 'circle' && 'Добавить круг'}
                    {element.type === 'text' && 'Добавить текст по кругу'}
                    {element.type === 'textCentered' && 'Добавить текст'}
                    {element.type === 'rectangle' && 'Добавить прямоугольник'}
                    {element.type === 'image' && 'Добавить картинку'}
                    {element.type === 'icon' && 'Добавить картинку'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(element.id, { visible: !element.visible });
                    }}
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {element.visible ? <Eye size={16} color="#6b7280" /> : <EyeOff size={16} color="#9ca3af" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(element.id);
                    }}
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Если показываем только настройки
  if (showOnlySettings) {
    if (!selectedElement) {
      return (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
          Выберите элемент для редактирования
        </p>
      );
    }

    return <ElementSettings element={selectedElement} />;
  }

  // Иначе показываем оба блока
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
          Список элементов
        </h4>
        {elements.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Элементов пока нет</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {elements.map((element) => (
              <div
                key={element.id}
                onClick={() => selectElement(element.id)}
                style={{
                  padding: '12px',
                  border: selectedElementId === element.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedElementId === element.id ? '#eff6ff' : '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <GripVertical size={16} color="#9ca3af" />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {element.type === 'circle' && 'Добавить круг'}
                    {element.type === 'text' && 'Добавить текст по кругу'}
                    {element.type === 'textCentered' && 'Добавить текст'}
                    {element.type === 'rectangle' && 'Добавить прямоугольник'}
                    {element.type === 'image' && 'Добавить картинку'}
                    {element.type === 'icon' && 'Добавить картинку'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(element.id, { visible: !element.visible });
                    }}
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {element.visible ? <Eye size={16} color="#6b7280" /> : <EyeOff size={16} color="#9ca3af" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(element.id);
                    }}
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedElement && (
        <div
          style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            padding: '16px',
          }}
        >
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Настройки элемента
          </h4>
          <ElementSettings element={selectedElement} />
        </div>
      )}
    </div>
  );
};

// Компонент для редактирования параметров элемента
function ElementSettings({ element }: { element: any }) {
  const updateElement = useStampStore((state) => state.updateElement);
  const canvasSize = useStampStore((state) => state.canvasSize);
  const [isIconGalleryOpen, setIsIconGalleryOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  if (element.type === 'circle') {
    const circleElement = element as CircleElementType;
    const hasFill = circleElement.fill && circleElement.fill !== 'none';

    return (
      <>
        <SliderInput
          label="Радиус круга"
          value={circleElement.radius}
          min={10}
          max={50}
          step={0.5}
          onChange={(value) => updateElement(element.id, { radius: value })}
        />

        <SliderInput
          label="Обводка"
          value={circleElement.strokeWidth}
          min={0}
          max={10}
          step={0.5}
          onChange={(value) => updateElement(element.id, { strokeWidth: value })}
        />

        <SliderInput
          label="Прерывистая обводка"
          value={circleElement.strokeDashArray || 0}
          min={0}
          max={20}
          step={1}
          onChange={(value) => updateElement(element.id, { strokeDashArray: value || undefined })}
        />

        <SliderInput
          label="Смещение по X"
          value={element.x}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { x: value })}
        />

        <SliderInput
          label="Смещение по Y"
          value={element.y}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { y: value })}
        />

        {/* Кнопка переключения заливки/обводки */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => {
              if (hasFill) {
                // Переключить на обводку
                updateElement(element.id, { fill: undefined, stroke: '#0000ff', strokeWidth: 1.5 });
              } else {
                // Переключить на заливку
                updateElement(element.id, { fill: '#0000ff', stroke: undefined, strokeWidth: undefined });
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#0000ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {hasFill ? 'Обводка' : 'Заливка'}
          </button>
        </div>
      </>
    );
  }

  if (element.type === 'text') {
    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Текст
          </label>
          <input
            type="text"
            value={(element as TextElementType).text}
            onChange={(e) => updateElement(element.id, { text: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Шрифт
          </label>
          <select
            value={(element as TextElementType).fontFamily}
            onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            {ALL_FONTS.map((font) => (
              <option key={font.family} value={font.family}>
                {font.name} ({font.category})
              </option>
            ))}
          </select>
        </div>

        <SliderInput
          label="Размер текста"
          value={(element as TextElementType).fontSize}
          min={2}
          max={20}
          step={0.5}
          onChange={(value) => updateElement(element.id, { fontSize: value })}
        />

        <SliderInput
          label="Радиус кривой"
          value={(element as TextElementType).curveRadius || 39}
          min={10}
          max={50}
          step={0.5}
          onChange={(value) => updateElement(element.id, { curveRadius: value })}
        />

        <SliderInput
          label="Начальный угол"
          value={(element as TextElementType).startAngle || 0}
          min={0}
          max={360}
          step={5}
          onChange={(value) => updateElement(element.id, { startAngle: value })}
          unit="°"
        />

        <SliderInput
          label="Межбуквенный интервал"
          value={(element as TextElementType).letterSpacing || 0}
          min={-2}
          max={10}
          step={0.5}
          onChange={(value) => updateElement(element.id, { letterSpacing: value })}
        />

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={(element as TextElementType).bold || false}
              onChange={(e) => updateElement(element.id, { bold: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Жирный</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={(element as TextElementType).italic || false}
              onChange={(e) => updateElement(element.id, { italic: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Курсив</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={(element as TextElementType).flipped || false}
              onChange={(e) => updateElement(element.id, { flipped: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Перевернуть</span>
          </label>
        </div>
      </>
    );
  }

  if (element.type === 'textCentered') {
    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Текст
          </label>
          <input
            type="text"
            value={(element as TextCenteredElementType).text}
            onChange={(e) => updateElement(element.id, { text: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Шрифт
          </label>
          <select
            value={(element as TextCenteredElementType).fontFamily}
            onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            {ALL_FONTS.map((font) => (
              <option key={font.family} value={font.family}>
                {font.name} ({font.category})
              </option>
            ))}
          </select>
        </div>

        <SliderInput
          label="Размер текста"
          value={(element as TextCenteredElementType).fontSize}
          min={2}
          max={20}
          step={0.5}
          onChange={(value) => updateElement(element.id, { fontSize: value })}
        />

        <SliderInput
          label="Смещение по X"
          value={element.x}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { x: value })}
        />

        <SliderInput
          label="Смещение по Y"
          value={element.y}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { y: value })}
        />

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={(element as TextCenteredElementType).bold || false}
              onChange={(e) => updateElement(element.id, { bold: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Жирный</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={(element as TextCenteredElementType).italic || false}
              onChange={(e) => updateElement(element.id, { italic: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Курсив</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={(element as TextCenteredElementType).flipped || false}
              onChange={(e) => updateElement(element.id, { flipped: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Перевернуть</span>
          </label>
        </div>
      </>
    );
  }

  if (element.type === 'rectangle') {
    const rectangleElement = element as RectangleElementType;
    const hasFill = rectangleElement.fill && rectangleElement.fill !== 'none';

    return (
      <>
        <SliderInput
          label="Ширина"
          value={rectangleElement.width}
          min={5}
          max={50}
          step={0.5}
          onChange={(value) => updateElement(element.id, { width: value })}
        />

        <SliderInput
          label="Высота"
          value={rectangleElement.height}
          min={5}
          max={50}
          step={0.5}
          onChange={(value) => updateElement(element.id, { height: value })}
        />

        <SliderInput
          label="Обводка"
          value={rectangleElement.strokeWidth}
          min={0}
          max={10}
          step={0.5}
          onChange={(value) => updateElement(element.id, { strokeWidth: value })}
        />

        <SliderInput
          label="Смещение по X"
          value={element.x}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { x: value })}
        />

        <SliderInput
          label="Смещение по Y"
          value={element.y}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { y: value })}
        />

        {/* Кнопка переключения заливки/обводки */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => {
              if (hasFill) {
                // Переключить на обводку
                updateElement(element.id, { fill: undefined, stroke: '#0000ff', strokeWidth: 1.5 });
              } else {
                // Переключить на заливку
                updateElement(element.id, { fill: '#0000ff', stroke: undefined, strokeWidth: undefined });
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#0000ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {hasFill ? 'Обводка' : 'Заливка'}
          </button>
        </div>
      </>
    );
  }

  if (element.type === 'image') {
    const imageElement = element as ImageElementType;

    return (
      <>
        <SliderInput
          label="Ширина"
          value={imageElement.width}
          min={5}
          max={50}
          step={0.5}
          onChange={(value) => updateElement(element.id, { width: value })}
        />

        <SliderInput
          label="Высота"
          value={imageElement.height}
          min={5}
          max={50}
          step={0.5}
          onChange={(value) => updateElement(element.id, { height: value })}
        />

        <SliderInput
          label="Смещение по X"
          value={element.x}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { x: value })}
        />

        <SliderInput
          label="Смещение по Y"
          value={element.y}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { y: value })}
        />

        {/* Кнопка конвертации в SVG */}
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1e40af' }}>
            <strong>Совет:</strong> Конвертируйте в SVG для возможности изменения цвета
          </p>
          <button
            onClick={async () => {
              setIsConverting(true);
              try {
                // Автоматическая конвертация: высокое качество, 16 цветов
                const svg = await vectorizeImage(imageElement.src, { quality: 'high', colorCount: 16 });
                // Применяем синий цвет
                const styledSvg = applySvgStyles(svg, { fill: '#0000ff' });

                // Заменяем ImageElement на IconElement и размещаем в центре
                updateElement(element.id, {
                  type: 'icon',
                  iconSource: 'custom',
                  svgContent: styledSvg,
                  fill: '#0000ff',
                  x: canvasSize / 2,
                  y: canvasSize / 2,
                });
              } catch (error) {
                console.error('Error vectorizing image:', error);
                alert('Ошибка при конвертации изображения');
              } finally {
                setIsConverting(false);
              }
            }}
            disabled={isConverting}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: isConverting ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isConverting ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {isConverting ? 'Конвертация...' : 'Конвертировать в SVG'}
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/png,image/jpeg,image/jpg';
              input.onchange = (e: Event) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const src = event.target?.result as string;
                    updateElement(element.id, { src });
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Заменить изображение
          </button>
        </div>
      </>
    );
  }

  if (element.type === 'icon') {
    const iconElement = element as IconElementType;

    return (
      <>
        <SliderInput
          label="Размер"
          value={iconElement.width}
          min={5}
          max={50}
          step={0.5}
          onChange={(value) => updateElement(element.id, { width: value, height: value })}
        />

        <SliderInput
          label="Смещение по X"
          value={element.x}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { x: value })}
        />

        <SliderInput
          label="Смещение по Y"
          value={element.y}
          min={0}
          max={100}
          step={1}
          onChange={(value) => updateElement(element.id, { y: value })}
        />

        {/* Кнопка заливки */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => updateElement(element.id, { fill: '#0000ff', stroke: undefined, strokeWidth: undefined })}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#0000ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Заливка
          </button>
        </div>

        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setIsIconGalleryOpen(true)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Заменить картинку
          </button>
        </div>

        {/* Icon Gallery Modal */}
        <IconGalleryModal
          isOpen={isIconGalleryOpen}
          onClose={() => setIsIconGalleryOpen(false)}
        />
      </>
    );
  }

  return null;
}
