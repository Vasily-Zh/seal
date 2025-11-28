import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useStampStore } from '../../store/useStampStore';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export const SliderInput = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
}: SliderInputProps) => {
  // Защита от undefined/null значений
  const safeValue = value ?? min;
  const [inputValue, setInputValue] = useState(safeValue.toString());
  const isDragging = useRef(false);

  useEffect(() => {
    setInputValue(safeValue.toString());
  }, [safeValue]);

  const handleSliderMouseDown = () => {
    isDragging.current = true;
    useStampStore.getState().startBatch();
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);

    if (isDragging.current) {
      // Когда тянем слайдер, обновляем без сохранения в историю
      onChange(newValue);
    } else {
      // Когда не тянем (например, кликаем), обновляем с сохранением в историю
      onChange(newValue);
    }
  };

  const handleSliderMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      useStampStore.getState().endBatch();
    }
  };

  // Отслеживаем, когда пользователь отпускает мышь вне элемента
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        useStampStore.getState().endBatch();
      }
    };

    if (isDragging.current) {
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue)) {
      newValue = safeValue;
    } else {
      newValue = Math.max(min, Math.min(max, newValue));
    }
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, safeValue + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, safeValue - step);
    onChange(newValue);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
        {label}
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Числовое поле с кнопками */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInputBlur();
              }
            }}
            style={{
              width: '70px',
              padding: '6px 8px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              textAlign: 'center',
            }}
          />

          {/* Стрелочки вверх/вниз */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '4px',
            gap: '2px'
          }}>
            <button
              onClick={handleIncrement}
              disabled={safeValue >= max}
              style={{
                padding: '2px 4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: safeValue >= max ? '#f3f4f6' : '#fff',
                cursor: safeValue >= max ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={handleDecrement}
              disabled={safeValue <= min}
              style={{
                padding: '2px 4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: safeValue <= min ? '#f3f4f6' : '#fff',
                cursor: safeValue <= min ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Значение в бейдже */}
          <div
            style={{
              marginLeft: '8px',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              minWidth: '45px',
              textAlign: 'center',
            }}
          >
            {safeValue}{unit}
          </div>
        </div>

        {/* Ползунок */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeValue}
          onChange={handleSliderChange}
          onMouseDown={handleSliderMouseDown}
          onMouseUp={handleSliderMouseUp}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            outline: 'none',
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((safeValue - min) / (max - min)) * 100}%, #e5e7eb ${((safeValue - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>
    </div>
  );
};
