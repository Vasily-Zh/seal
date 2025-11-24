import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ALL_FONTS, getFontVariantStyle } from '../../utils/fonts';
import type { FontConfig, FontVariant } from '../../types';

interface FontSelectorProps {
  value: string; // текущее значение fontFamily
  onChange: (fontFamily: string) => void;
  label?: string;
}

export const FontSelector = ({ value, onChange, label = 'Шрифт' }: FontSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFonts, setExpandedFonts] = useState<Set<string>>(new Set());
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

  // Найти текущий выбранный шрифт и вариант
  const getCurrentFontDisplay = () => {
    for (const font of ALL_FONTS) {
      if (font.variants && font.variants.length > 0) {
        const matchingVariant = font.variants.find(v => v.family === value);
        if (matchingVariant) {
          return `${font.name} - ${matchingVariant.name}`;
        }
      } else if (font.family === value) {
        return font.name;
      }
    }
    return 'Arial'; // fallback
  };

  // Переключить раскрытие группы шрифта
  const toggleFontExpanded = (fontName: string) => {
    const newExpanded = new Set(expandedFonts);
    if (newExpanded.has(fontName)) {
      newExpanded.delete(fontName);
    } else {
      newExpanded.add(fontName);
    }
    setExpandedFonts(newExpanded);
  };

  // Выбрать вариант шрифта
  const selectVariant = (fontFamily: string) => {
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
            const isExpanded = expandedFonts.has(font.name);
            const hasVariants = font.variants && font.variants.length > 1;

            return (
              <div key={font.name}>
                {/* Основная строка шрифта */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: font.isPrintingFont ? '#f0f9ff' : 'white',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = font.isPrintingFont ? '#f0f9ff' : 'white';
                  }}
                >
                  {/* Иконка раскрытия для шрифтов с вариантами */}
                  {hasVariants && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFontExpanded(font.name);
                      }}
                      style={{
                        marginRight: '8px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown size={16} color="#6b7280" />
                      ) : (
                        <ChevronRight size={16} color="#6b7280" />
                      )}
                    </div>
                  )}

                  {/* Название шрифта */}
                  <div
                    onClick={() => {
                      if (hasVariants) {
                        // Если есть варианты, выбираем первый (Regular)
                        selectVariant(font.variants![0].family);
                      } else {
                        selectVariant(font.family);
                      }
                    }}
                    style={{
                      flex: 1,
                      fontFamily: font.family,
                      fontSize: '14px',
                    }}
                  >
                    {font.name}
                    {font.isPrintingFont && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '11px',
                          color: '#3b82f6',
                          fontWeight: '600',
                        }}
                      >
                        [Полиграфия]
                      </span>
                    )}
                  </div>
                </div>

                {/* Варианты шрифта (раскрывающиеся) */}
                {hasVariants && isExpanded && (
                  <div style={{ backgroundColor: '#f9fafb' }}>
                    {font.variants!.map((variant) => (
                      <div
                        key={`${font.name}-${variant.name}`}
                        onClick={() => selectVariant(variant.family)}
                        style={{
                          padding: '8px 12px 8px 40px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontFamily: variant.family,
                          borderBottom: '1px solid #f3f4f6',
                          backgroundColor: value === variant.family ? '#dbeafe' : '#f9fafb',
                          ...getFontVariantStyle(variant),
                        }}
                        onMouseEnter={(e) => {
                          if (value !== variant.family) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (value !== variant.family) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }
                        }}
                      >
                        {variant.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
