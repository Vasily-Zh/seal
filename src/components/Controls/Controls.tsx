import { Trash2, Eye, EyeOff, GripVertical, Target, Settings as SettingsIcon, Layers, Download, Copy } from 'lucide-react';
import { useState } from 'react';
import { useStampStore } from '../../store/useStampStore';
import { SliderInput } from './SliderInput';
import { FontSelector } from './FontSelector';
import type { CircleElement as CircleElementType, TextElement as TextElementType, TextCenteredElement as TextCenteredElementType, RectangleElement as RectangleElementType, TriangleElement as TriangleElementType, ImageElement as ImageElementType, IconElement as IconElementType, LineElement as LineElementType, GroupElement as GroupElementType } from '../../types';
import { IconGalleryModal } from '../Toolbar/IconGalleryModal';
import { LayersPanel } from './LayersPanel';
import { exportElementToSVG } from '../../utils/export';

interface ControlsProps {
  showOnlyElements?: boolean;
  showOnlySettings?: boolean;
}

export const Controls = ({ showOnlyElements = false, showOnlySettings = false }: ControlsProps) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'layers'>('settings');
  const elements = useStampStore((state) => state.elements);
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const updateElement = useStampStore((state) => state.updateElement);
  const removeElement = useStampStore((state) => state.removeElement);
  const duplicateElement = useStampStore((state) => state.duplicateElement);
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
                    {element.type === 'triangle' && 'Добавить треугольник'}
                    {element.type === 'line' && 'Добавить линию'}  {/* Компонент отображения линии */}
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
                    title={element.visible ? 'Скрыть' : 'Показать'}
                  >
                    {element.visible ? <Eye size={16} color="#6b7280" /> : <EyeOff size={16} color="#9ca3af" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateElement(element.id);
                    }}
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                    title="Дублировать"
                  >
                    <Copy size={16} color="#6b7280" />
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
                    title="Удалить"
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

  // Иначе показываем табы
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Табы */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: activeTab === 'settings' ? '#3b82f6' : 'transparent',
            color: activeTab === 'settings' ? 'white' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <SettingsIcon size={16} />
          Настройки
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: activeTab === 'layers' ? '#3b82f6' : 'transparent',
            color: activeTab === 'layers' ? 'white' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
        >
          <Layers size={16} />
          Слои
        </button>
      </div>

      {/* Контент табов */}
      {activeTab === 'layers' ? (
        <LayersPanel />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
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
                    {element.type === 'triangle' && 'Добавить треугольник'}
                    {element.type === 'line' && 'Добавить линию'}  {/* Компонент отображения линии */}
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
                    title={element.visible ? 'Скрыть' : 'Показать'}
                  >
                    {element.visible ? <Eye size={16} color="#6b7280" /> : <EyeOff size={16} color="#9ca3af" />}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateElement(element.id);
                    }}
                    style={{
                      padding: '4px',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                    title="Дублировать"
                  >
                    <Copy size={16} color="#6b7280" />
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
                    title="Удалить"
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
      )}
    </div>
  );
};

// Компонент для редактирования параметров элемента
function ElementSettings({ element }: { element: CircleElementType | TextElementType | TextCenteredElementType | RectangleElementType | TriangleElementType | ImageElementType | IconElementType | LineElementType | GroupElementType }) {
  const updateElement = useStampStore((state) => state.updateElement);
  const centerElement = useStampStore((state) => state.centerElement);
  const [isIconGalleryOpen, setIsIconGalleryOpen] = useState(false);

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

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
        </div>

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

        <FontSelector
          value={(element as TextElementType).fontFamily}
          onChange={(fontFamily) => updateElement(element.id, { fontFamily })}
        />

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

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
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

        <FontSelector
          value={(element as TextCenteredElementType).fontFamily}
          onChange={(fontFamily) => updateElement(element.id, { fontFamily })}
        />

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

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
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
          min={1}
          max={100}
          step={0.5}
          onChange={(value) => updateElement(element.id, { width: value })}
        />

        <SliderInput
          label="Высота"
          value={rectangleElement.height}
          min={1}
          max={100}
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

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
        </div>

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

  if (element.type === 'triangle') {
    const triangleElement = element as TriangleElementType;
    const hasFill = triangleElement.fill && triangleElement.fill !== 'none';
    const heightRatio = triangleElement.heightRatio !== undefined ? triangleElement.heightRatio : 1;

    return (
      <>
        <SliderInput
          label="Размер треугольника"
          value={triangleElement.size}
          min={5}
          max={100}
          step={0.5}
          onChange={(value) => updateElement(element.id, { size: value })}
        />

        <SliderInput
          label={`Высота: ${(heightRatio * 100).toFixed(0)}%`}
          value={heightRatio}
          min={0.2}
          max={2}
          step={0.1}
          onChange={(value) => updateElement(element.id, { heightRatio: value })}
        />

        <SliderInput
          label="Обводка"
          value={triangleElement.strokeWidth}
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

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
        </div>

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
          max={100}
          step={0.5}
          onChange={(value) => updateElement(element.id, { width: value })}
        />

        <SliderInput
          label="Высота"
          value={imageElement.height}
          min={5}
          max={100}
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

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
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
    const hasFill = iconElement.fill && iconElement.fill !== 'none';

    return (
      <>
        <SliderInput
          label="Размер"
          value={iconElement.width}
          min={5}
          max={100}
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

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
        </div>

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

        {/* Кнопка экспорта SVG */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={async () => {
              try {
                await exportElementToSVG(iconElement);
              } catch (error) {
                console.error('Error exporting element:', error);
                alert('Ошибка при экспорте элемента');
              }
            }}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Download size={16} />
            Экспорт SVG
          </button>
        </div>

        {/* Icon Gallery Modal */}
        <IconGalleryModal
          isOpen={isIconGalleryOpen}
          onClose={() => setIsIconGalleryOpen(false)}
          selectedElementId={element.id}
        />
      </>
    );
  }

  // Обработка настроек для линии
  if (element.type === 'line') {
    const lineElement = element as LineElementType;

    // Вычисляем длину линии с помощью теоремы Пифагора
    const length = Math.sqrt(Math.pow(lineElement.x2 - element.x, 2) + Math.pow(lineElement.y2 - element.y, 2));

    return (
      <>
        <SliderInput
          label="Толщина линии"
          value={lineElement.strokeWidth}
          min={0.5}
          max={10}
          step={0.5}
          onChange={(value) => updateElement(element.id, { strokeWidth: value })}
        />

        <SliderInput
          label={`Длина линии: ${length.toFixed(2)} мм`}
          value={length}
          min={1}
          max={141} // Максимальная диагональ в квадрате 100x100
          step={0.5}
          onChange={(value) => {
            // При изменении длины сохраняем угол наклона линии
            // Вычисляем текущую длину
            const currentLength = Math.sqrt(Math.pow(lineElement.x2 - element.x, 2) + Math.pow(lineElement.y2 - element.y, 2));
            if (currentLength === 0) return;

            // Вычисляем вектор направления
            const dirX = (lineElement.x2 - element.x) / currentLength;
            const dirY = (lineElement.y2 - element.y) / currentLength;

            // Новая длина
            const newX2 = element.x + dirX * value;
            const newY2 = element.y + dirY * value;

            updateElement(element.id, { x2: newX2, y2: newY2 });
          }}
        />

        <SliderInput
          label="Начальная X координата"
          value={element.x}
          min={0}
          max={100}
          step={0.5}
          onChange={(value) => updateElement(element.id, { x: value })}
        />

        <SliderInput
          label="Начальная Y координата"
          value={element.y}
          min={0}
          max={100}
          step={0.5}
          onChange={(value) => updateElement(element.id, { y: value })}
        />

        <SliderInput
          label="Конечная X координата"
          value={lineElement.x2}
          min={0}
          max={100}
          step={0.5}
          onChange={(value) => updateElement(element.id, { x2: value })}
        />

        <SliderInput
          label="Конечная Y координата"
          value={lineElement.y2}
          min={0}
          max={100}
          step={0.5}
          onChange={(value) => updateElement(element.id, { y2: value })}
        />

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
        </div>
      </>
    );
  }

  if (element.type === 'group') {
    const groupElement = element as GroupElementType;

    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
            Название группы
          </label>
          <input
            type="text"
            value={groupElement.name}
            onChange={(e) => updateElement(element.id, { name: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

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

        <SliderInput
          label="Поворот"
          value={groupElement.rotation || 0}
          min={0}
          max={360}
          step={1}
          onChange={(value) => updateElement(element.id, { rotation: value })}
          unit="°"
        />

        <SliderInput
          label="Масштаб по X"
          value={groupElement.scaleX || 1}
          min={0.1}
          max={5}
          step={0.1}
          onChange={(value) => updateElement(element.id, { scaleX: value })}
        />

        <SliderInput
          label="Масштаб по Y"
          value={groupElement.scaleY || 1}
          min={0.1}
          max={5}
          step={0.1}
          onChange={(value) => updateElement(element.id, { scaleY: value })}
        />

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={groupElement.expanded || false}
              onChange={(e) => updateElement(element.id, { expanded: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Развернута в панели слоёв</span>
          </label>
        </div>

        {/* Кнопка центрирования */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => centerElement(element.id)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Target size={16} />
            Центрировать
          </button>
        </div>
      </>
    );
  }

  return null;
}
