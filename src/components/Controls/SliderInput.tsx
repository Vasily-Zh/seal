import { ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let newValue = parseFloat(inputValue);
    if (isNaN(newValue)) {
      newValue = value;
    } else {
      newValue = Math.max(min, Math.min(max, newValue));
    }
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
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
              disabled={value >= max}
              style={{
                padding: '2px 4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: value >= max ? '#f3f4f6' : '#fff',
                cursor: value >= max ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={handleDecrement}
              disabled={value <= min}
              style={{
                padding: '2px 4px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: value <= min ? '#f3f4f6' : '#fff',
                cursor: value <= min ? 'not-allowed' : 'pointer',
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
            {value}{unit}
          </div>
        </div>

        {/* Ползунок */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '3px',
            outline: 'none',
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`,
          }}
        />
      </div>
    </div>
  );
};
