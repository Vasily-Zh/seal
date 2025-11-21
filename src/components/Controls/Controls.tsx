import { Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import { SliderInput } from './SliderInput';
import { ALL_FONTS } from '../../utils/fonts';
import type { CircleElement as CircleElementType, TextElement as TextElementType } from '../../types';

export const Controls = () => {
  const elements = useStampStore((state) => state.elements);
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const updateElement = useStampStore((state) => state.updateElement);
  const removeElement = useStampStore((state) => state.removeElement);
  const selectElement = useStampStore((state) => state.selectElement);

  const selectedElement = elements.find((el) => el.id === selectedElementId);

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e5e7eb',
        overflowY: 'auto',
        height: '100%',
      }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
          Элементы макета
        </h3>

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
                    {element.type === 'circle' && 'Окружность'}
                    {element.type === 'text' && 'Текст по кругу'}
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

      {/* Настройки выбранного элемента */}
      {selectedElement && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Настройки элемента
          </h3>

          {selectedElement.type === 'circle' && (
            <>
              <SliderInput
                label="Радиус круга"
                value={(selectedElement as CircleElementType).radius}
                min={10}
                max={50}
                step={0.5}
                onChange={(value) => updateElement(selectedElement.id, { radius: value })}
              />

              <SliderInput
                label="Обводка"
                value={(selectedElement as CircleElementType).strokeWidth}
                min={0}
                max={10}
                step={0.5}
                onChange={(value) => updateElement(selectedElement.id, { strokeWidth: value })}
              />

              <SliderInput
                label="Прерывистая обводка"
                value={(selectedElement as CircleElementType).strokeDashArray || 0}
                min={0}
                max={20}
                step={1}
                onChange={(value) => updateElement(selectedElement.id, { strokeDashArray: value || undefined })}
              />

              <SliderInput
                label="Смещение по X"
                value={selectedElement.x}
                min={0}
                max={100}
                step={1}
                onChange={(value) => updateElement(selectedElement.id, { x: value })}
              />

              <SliderInput
                label="Смещение по Y"
                value={selectedElement.y}
                min={0}
                max={100}
                step={1}
                onChange={(value) => updateElement(selectedElement.id, { y: value })}
              />
            </>
          )}

          {selectedElement.type === 'text' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                  Текст
                </label>
                <input
                  type="text"
                  value={(selectedElement as TextElementType).text}
                  onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
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
                  value={(selectedElement as TextElementType).fontFamily}
                  onChange={(e) => updateElement(selectedElement.id, { fontFamily: e.target.value })}
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
                value={(selectedElement as TextElementType).fontSize}
                min={2}
                max={20}
                step={0.5}
                onChange={(value) => updateElement(selectedElement.id, { fontSize: value })}
              />

              <SliderInput
                label="Радиус кривой"
                value={(selectedElement as TextElementType).curveRadius || 39}
                min={10}
                max={50}
                step={0.5}
                onChange={(value) => updateElement(selectedElement.id, { curveRadius: value })}
              />

              <SliderInput
                label="Начальный угол"
                value={(selectedElement as TextElementType).startAngle || 0}
                min={0}
                max={360}
                step={5}
                onChange={(value) => updateElement(selectedElement.id, { startAngle: value })}
                unit="°"
              />

              <SliderInput
                label="Межбуквенный интервал"
                value={(selectedElement as TextElementType).letterSpacing || 0}
                min={-2}
                max={10}
                step={0.5}
                onChange={(value) => updateElement(selectedElement.id, { letterSpacing: value })}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
