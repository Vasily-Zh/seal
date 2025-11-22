import { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';
import { searchAllIcons, getAutocompleteSuggestions, type IconInfo } from '../../data/allIcons';
import { useStampStore } from '../../store/useStampStore';

interface IconSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICONS_PER_PAGE = 25;

// Популярные теги для печатей (отсортированы по релевантности)
const POPULAR_TAGS = [
  'звезда',
  'щит',
  'круг',
  'корона',
  'печать',
  'герб',
  'флаг',
  'медаль',
  'значок',
  'здание',
  'молоток',
  'весы',
  'книга',
  'стрелка',
  'галочка',
  'крест',
  'сердце',
  'цветок',
  'солнце',
  'лист',
];

export const IconSearchModal = ({ isOpen, onClose }: IconSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(ICONS_PER_PAGE);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const addElement = useStampStore((state) => state.addElement);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Получаем предложения для автокомплита
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return getAutocompleteSuggestions(searchQuery, 10);
  }, [searchQuery]);

  // Фильтруем иконки по поисковому запросу
  const filteredIcons = useMemo(() => {
    return searchAllIcons(searchQuery);
  }, [searchQuery]);

  // Показываем только первые displayCount иконок
  const displayedIcons = useMemo(() => {
    return filteredIcons.slice(0, displayCount);
  }, [filteredIcons, displayCount]);

  // Проверяем, есть ли еще иконки для загрузки
  const hasMore = displayedIcons.length < filteredIcons.length;

  // Обработчик выбора иконки
  const handleIconSelect = (icon: IconInfo) => {
    addElement({
      id: `icon-${Date.now()}`,
      type: 'icon',
      iconName: icon.name,
      iconSource: icon.source,
      x: canvasSize / 2,
      y: canvasSize / 2,
      width: 15,
      height: 15,
      visible: true,
      svgContent: undefined,
    });
    onClose();
  };

  // Обработчик загрузки дополнительных иконок
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ICONS_PER_PAGE);
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setDisplayCount(ICONS_PER_PAGE);
    setShowAutocomplete(value.trim().length > 0);
    setSelectedSuggestionIndex(-1);
  };

  // Обработчик выбора подсказки
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowAutocomplete(false);
    setDisplayCount(ICONS_PER_PAGE);
  };

  // Обработчик клика по тегу
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    setShowAutocomplete(false);
    setDisplayCount(ICONS_PER_PAGE);
  };

  // Обработчик нажатия клавиш в поле поиска
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || suggestions.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
        handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
      } else {
        setShowAutocomplete(false);
      }
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Рендер иконки
  const renderIcon = (icon: IconInfo) => {
    if (icon.source === 'lucide') {
      // @ts-expect-error - динамический импорт
      const IconComponent = LucideIcons[icon.name];
      return IconComponent ? <IconComponent size={32} /> : null;
    } else if (icon.source === 'heroicons') {
      // @ts-expect-error - динамический импорт
      const IconComponent = HeroIcons[icon.name];
      return IconComponent ? <IconComponent style={{ width: 32, height: 32 }} /> : null;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 12,
          width: '90%',
          maxWidth: 800,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#111827' }}>
            Поиск картинок для печати
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 6,
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        {/* Search with Autocomplete */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Введите название иконки (например: звезда, круг, щит...)"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowAutocomplete(searchQuery.trim().length > 0)}
              onBlur={() => {
                // Задержка, чтобы клик по подсказке успел сработать
                setTimeout(() => setShowAutocomplete(false), 200);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #d1d5db',
                borderRadius: 8,
                fontSize: 15,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!showAutocomplete) {
                  e.currentTarget.style.borderColor = '#3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                if (!showAutocomplete) {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            />

            {/* Autocomplete Dropdown */}
            {showAutocomplete && suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  backgroundColor: '#fff',
                  border: '1px solid #d1d5db',
                  borderRadius: 8,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionSelect(suggestion);
                    }}
                    onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor:
                        selectedSuggestionIndex === index ? '#f3f4f6' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 14,
                      color: '#111827',
                      transition: 'background-color 0.15s',
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Tags */}
          {!searchQuery.trim() && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  fontSize: 13,
                  color: '#6b7280',
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Популярные запросы:
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                {POPULAR_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: 16,
                      fontSize: 13,
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e5e7eb';
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.color = '#1f2937';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Counter */}
          {searchQuery.trim() && (
            <div
              style={{
                marginTop: 12,
                fontSize: 13,
                color: '#6b7280',
              }}
            >
              Найдено иконок: {filteredIcons.length}
            </div>
          )}
        </div>

        {/* Icons Grid */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 24,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 16,
            }}
          >
            {displayedIcons.map((icon, index) => (
              <button
                key={`${icon.name}-${index}`}
                onClick={() => handleIconSelect(icon)}
                style={{
                  padding: 16,
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ color: '#0369a1' }}>{renderIcon(icon)}</div>
                <span
                  style={{
                    fontSize: 11,
                    color: '#6b7280',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {icon.displayName}
                </span>
              </button>
            ))}
          </div>

          {/* Empty State */}
          {displayedIcons.length === 0 && !searchQuery.trim() && (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#9ca3af',
              }}
            >
              Введите запрос для поиска иконок
            </div>
          )}

          {/* No Results */}
          {displayedIcons.length === 0 && searchQuery.trim() && (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#9ca3af',
              }}
            >
              Иконки не найдены по запросу "{searchQuery}"
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Показано {displayedIcons.length} из {filteredIcons.length}
            </div>
            <button
              onClick={handleLoadMore}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#fbbf24',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f59e0b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fbbf24';
              }}
            >
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
