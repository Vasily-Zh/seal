import { useState, useMemo } from 'react';
import { X, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';
import { categories, type IconCategory, type IconInfo } from '../../data/iconCollections';
import { useStampStore } from '../../store/useStampStore';

interface IconGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedElementId?: string;
}

const ICONS_PER_PAGE = 25;

export const IconGalleryModal = ({ isOpen, onClose, selectedElementId }: IconGalleryModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState<IconCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(ICONS_PER_PAGE);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const addElement = useStampStore((state) => state.addElement);
  const updateElement = useStampStore((state) => state.updateElement);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Получаем картинки текущей категории
  const currentCategoryIcons = useMemo(() => {
    if (selectedCategory === 'all') {
      // Возвращаем все картинки из всех категорий
      return categories.flatMap((cat) => cat.icons);
    }
    const category = categories.find((c) => c.id === selectedCategory);
    return category ? category.icons : [];
  }, [selectedCategory]);

  // Фильтруем картинки по поисковому запросу
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return currentCategoryIcons;
    }
    const lowerQuery = searchQuery.toLowerCase();
    return currentCategoryIcons.filter(
      (icon) =>
        icon.displayName.toLowerCase().includes(lowerQuery) ||
        icon.name.toLowerCase().includes(lowerQuery)
    );
  }, [currentCategoryIcons, searchQuery]);

  // Показываем только первые displayCount картинок
  const displayedIcons = useMemo(() => {
    return filteredIcons.slice(0, displayCount);
  }, [filteredIcons, displayCount]);

  // Проверяем, есть ли еще картинки для загрузки
  const hasMore = displayedIcons.length < filteredIcons.length;

  // Обработчик выбора картинки
  const handleIconSelect = (icon: IconInfo) => {
    // Если редактируем существующий элемент, обновляем его вместо создания нового
    if (selectedElementId) {
      updateElement(selectedElementId, {
        iconName: icon.name,
        iconSource: icon.source,
        svgContent: undefined,
        // Lucide иконки используют stroke, Heroicons используют fill
        ...(icon.source === 'lucide' ? { stroke: '#0000ff', strokeWidth: 2 } : { fill: '#0000ff' }),
      });
    } else {
      // Создаем новый элемент
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
        // Lucide иконки используют stroke, Heroicons используют fill
        ...(icon.source === 'lucide' ? { stroke: '#0000ff', strokeWidth: 2 } : { fill: '#0000ff' }),
      });
    }
    onClose();
  };

  // Обработчик загрузки дополнительных картинок
  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ICONS_PER_PAGE);
  };

  // Обработчик смены категории
  const handleCategoryChange = (categoryId: IconCategory | 'all') => {
    setSelectedCategory(categoryId);
    setDisplayCount(ICONS_PER_PAGE);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  // Рендер картинки
  const renderIcon = (icon: IconInfo) => {
    if (icon.source === 'lucide') {
      // @ts-expect-error - динамический импорт
      const IconComponent = LucideIcons[icon.name];
      return IconComponent ? <IconComponent size={32} /> : null;
    } else if (icon.source === 'heroicons') {
      // @ts-expect-error - динамический импорт
      const IconComponent = HeroIcons[icon.name];
      return IconComponent ? <IconComponent style={{ width: 32, height: 32 }} /> : null;
    } else if (icon.source === 'custom' && icon.name) {
      // Для custom SVG можно показать placeholder
      return <div style={{ width: 32, height: 32, background: '#e5e7eb', borderRadius: 4 }} />;
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
            Галерея картинок
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

        {/* Search and Category */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          {/* Search */}
          <input
            type="text"
            placeholder="Поиск по описанию"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              marginBottom: 12,
              outline: 'none',
            }}
          />

          {/* Category Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                outline: 'none',
              }}
            >
              <span>
                {selectedCategory === 'all'
                  ? 'Выбор категории'
                  : categories.find((c) => c.id === selectedCategory)?.name || 'Выбор категории'}
              </span>
              <ChevronDown
                size={16}
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 4,
                  backgroundColor: '#fff',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  zIndex: 10,
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
              >
                {/* Опция "Выбор категории" (все категории) */}
                <button
                  onClick={() => handleCategoryChange('all')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: 'none',
                    backgroundColor: selectedCategory === 'all' ? '#f3f4f6' : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 14,
                    color: '#111827',
                  }}
                >
                  Выбор категории
                </button>

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: 'none',
                      backgroundColor:
                        selectedCategory === category.id ? '#f3f4f6' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 14,
                      color: '#111827',
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          {displayedIcons.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: 40,
                color: '#9ca3af',
              }}
            >
              Картинки не найдены
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
            }}
          >
            <button
              onClick={handleLoadMore}
              style={{
                width: '100%',
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
