import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ALL_FONTS } from '../../utils/fonts';

interface FontSelectorProps {
  value: string; // текущее значение fontFamily
  onChange: (fontFamily: string) => void;
  label?: string;
}

export const FontSelector = ({ value, onChange, label = 'Шрифт' }: FontSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Найти текущий выбранный шрифт
  const getCurrentFontDisplay = () => {
    const font = ALL_FONTS.find(f => f.family === value);
    return font ? font.name : 'Roboto'; // fallback к Google Font
  };

  // Выбрать шрифт
  const selectFont = (fontFamily: string) => {
    onChange(fontFamily);
    setIsOpen(false);
  };

  return (
    <div style={{ marginBottom: '16px' }} ref={dropdownRef}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
        {label}
      </label>

      {/* Кнопка выбора */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
        }}
      >
        <span>{getCurrentFontDisplay()}</span>
        <ChevronDown size={16} color="#6b7280" />
      </button>

      {/* Dropdown список */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            marginTop: '4px',
            width: dropdownRef.current?.offsetWidth || '100%',
            maxHeight: '400px',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {ALL_FONTS.map((font) => {
            const isSelected = font.family === value;

            return (
              <div
                key={font.name}
                onClick={() => selectFont(font.family)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: font.family,
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: isSelected ? '#dbeafe' : 'white',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                {font.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
