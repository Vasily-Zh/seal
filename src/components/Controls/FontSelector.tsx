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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fontListRef = useRef<HTMLDivElement>(null);
  const selectedFontRef = useRef<HTMLDivElement>(null);

  // Вычисление позиции dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Закрытие dropdown при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Используем touchstart для iOS
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
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
      }, 50);
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

  // Обработчик открытия/закрытия
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ marginBottom: '16px', position: 'relative' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
        {label}
      </label>

      {/* Кнопка выбора */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
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
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span>{getCurrentFontDisplay()}</span>
        <ChevronDown size={16} color="#6b7280" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Dropdown список - фиксированное позиционирование для iOS */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            zIndex: 9999,
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width || '100%',
            maxHeight: '50vh',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Поле поиска */}
          <div style={{
            padding: '8px',
            borderBottom: '1px solid #d1d5db',
            display: 'flex',
            alignItems: 'center',
            flex: '0 0 auto',
          }}>
            <input
              type="text"
              placeholder="Поиск шрифта..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px', // 16px чтобы iOS не зумил
                WebkitAppearance: 'none',
              }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                style={{
                  marginLeft: '4px',
                  padding: '8px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Список шрифтов */}
          <div 
            ref={fontListRef} 
            style={{ 
              overflowY: 'auto', 
              flex: '1 1 auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {sortedFonts.length > 0 ? (
              sortedFonts.map((font) => {
                const isSelected = font.family === value;

                return (
                  <div
                    key={font.name}
                    ref={isSelected && !searchTerm ? selectedFontRef : null}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectFont(font.family);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontFamily: font.family,
                      borderBottom: '1px solid #f3f4f6',
                      backgroundColor: isSelected ? '#dbeafe' : 'white',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {font.name}
                  </div>
                );
              })
            ) : (
              <div style={{
                padding: '16px',
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
