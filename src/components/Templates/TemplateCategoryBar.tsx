import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useTemplatesStore } from '../../store/useTemplatesStore';

interface TemplateCategoryBarProps {
  onCategoryClick: (categoryId: string) => void;
  onAllTemplatesClick: () => void;
  onGeneratorClick: () => void;
}

export const TemplateCategoryBar = ({
  onCategoryClick,
  onAllTemplatesClick,
  onGeneratorClick,
}: TemplateCategoryBarProps) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'all'>('sections');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Проверка на мобильное устройство
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Получаем категории из store
  const categories = useTemplatesStore((state) => state.categories);
  const loadFromServer = useTemplatesStore((state) => state.loadFromServer);
  
  // Загружаем данные при первом рендере
  useEffect(() => {
    loadFromServer();
  }, []);
  
  // Сортируем категории
  const allCategories = [...categories].sort((a, b) => a.order - b.order);

  // Проверка возможности прокрутки
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [allCategories]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 16px',
      }}
    >
      {/* Верхняя строка: Табы + Кнопка генератора */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '8px' : '0',
        }}
      >
        {/* Табы */}
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          flexWrap: 'wrap',
          flex: isMobile ? '1 1 100%' : 'none',
        }}>
          <button
            onClick={() => setActiveTab('sections')}
            style={{
              padding: isMobile ? '6px 12px' : '8px 16px',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'sections' ? '#0ea5e9' : '#f3f4f6',
              color: activeTab === 'sections' ? '#fff' : '#374151',
              transition: 'all 0.2s',
            }}
          >
            Разделы шаблонов
          </button>
          <button
            onClick={() => {
              setActiveTab('all');
              onAllTemplatesClick();
            }}
            style={{
              padding: isMobile ? '6px 12px' : '8px 16px',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'all' ? '#0ea5e9' : '#f3f4f6',
              color: activeTab === 'all' ? '#fff' : '#374151',
              transition: 'all 0.2s',
            }}
          >
            Все шаблоны
          </button>
        </div>

        {/* Кнопка генератора */}
        <button
          onClick={onGeneratorClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: isMobile ? '8px 12px' : '10px 20px',
            fontSize: isMobile ? '12px' : '14px',
            fontWeight: '600',
            backgroundColor: '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
            flex: isMobile ? '1 1 100%' : 'none',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Sparkles size={isMobile ? 16 : 18} />
          Генератор печатей
        </button>
      </div>

      {/* Карусель категорий */}
      {activeTab === 'sections' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Стрелка влево - скрываем на мобильных */}
          {!isMobile && (
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: canScrollLeft ? '#fff' : '#f9fafb',
                cursor: canScrollLeft ? 'pointer' : 'default',
                opacity: canScrollLeft ? 1 : 0.5,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={18} color={canScrollLeft ? '#374151' : '#9ca3af'} />
            </button>
          )}

          {/* Карусель */}
          <div
            ref={carouselRef}
            onScroll={checkScroll}
            style={{
              display: 'flex',
              gap: isMobile ? '8px' : '12px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              flex: 1,
              padding: '4px 0',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {allCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryClick(category.id)}
                style={{
                  padding: isMobile ? '8px 16px' : '10px 24px',
                  fontSize: isMobile ? '12px' : '13px',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: '#fff',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0ea5e9';
                  e.currentTarget.style.color = '#0ea5e9';
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Стрелка вправо - скрываем на мобильных */}
          {!isMobile && (
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: canScrollRight ? '#fff' : '#f9fafb',
                cursor: canScrollRight ? 'pointer' : 'default',
                opacity: canScrollRight ? 1 : 0.5,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <ChevronRight size={18} color={canScrollRight ? '#374151' : '#9ca3af'} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
