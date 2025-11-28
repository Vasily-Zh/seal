import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ALL_FONTS } from '../../utils/fonts';

interface FontSelectorProps {
  value: string; // текущее значение fontFamily
  onChange: (fontFamily: string) => void;
  label?: string;
}

export const FontSelector = ({ value, onChange, label = 'Шрифт' }: FontSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fontListRef = useRef<HTMLDivElement>(null);
  const selectedFontRef = useRef<HTMLDivElement>(null);

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

  // Прокрутка к выбранному шрифту при открытии
  useEffect(() => {
    if (isOpen && !searchTerm && fontListRef.current && selectedFontRef.current) {
      // Нужно немного подождать, чтобы элементы отрендерились
      setTimeout(() => {
        selectedFontRef.current?.scrollIntoView({
          behavior: 'auto',
          block: 'nearest',
          inline: 'nearest'
        });
      }, 10);
    }
  }, [isOpen, searchTerm]);

  // Найти текущий выбранный шрифт
  const getCurrentFontDisplay = () => {
    const font = ALL_FONTS.find(f => f.family === value);
    return font ? font.name : 'Roboto'; // fallback к Google Font
  };

  // Фильтрация шрифтов по поисковому запросу
  const filteredFonts = ALL_FONTS.filter(font =>
    font.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    font.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Сортировка: все шрифты по алфавиту (без перемещения выбранного наверх)
  const sortedFonts = [...filteredFonts].sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }); // Сортировка по алфавиту
  });

  // Выбрать шрифт
  const selectFont = (fontFamily: string) => {
    onChange(fontFamily);
    setIsOpen(false);
    setSearchTerm(''); // Очищаем поисковый запрос после выбора
  };

  // Обработчик очистки поиска
  const clearSearch = () => {
    setSearchTerm('');
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
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Поле поиска */}
          <div style={{
            padding: '8px',
            borderBottom: '1px solid #d1d5db',
            display: 'flex',
            alignItems: 'center',
          }}>
            <input
              type="text"
              placeholder="Поиск шрифта..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px',
              }}
              onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на инпут
            />
            {searchTerm && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSearch();
                }}
                style={{
                  marginLeft: '4px',
                  padding: '4px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Список шрифтов */}
          <div ref={fontListRef} style={{ overflowY: 'auto', maxHeight: '300px' }}>
            {sortedFonts.length > 0 ? (
              sortedFonts.map((font) => {
                const isSelected = font.family === value;

                return (
                  <div
                    key={font.name}
                    ref={isSelected && !searchTerm ? selectedFontRef : null} // Установить ref только для выбранного шрифта при отсутствии поиска
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
              })
            ) : (
              <div style={{
                padding: '12px',
                fontSize: '14px',
                color: '#6b7280',
                textAlign: 'center',
              }}>
                Шрифт не найден
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
