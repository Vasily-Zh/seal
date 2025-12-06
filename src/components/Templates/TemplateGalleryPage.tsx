import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTemplatesStore } from '../../store/useTemplatesStore';
import { TemplatePreview } from './TemplatePreview';
import type { StampTemplate } from '../../types/templates';

interface TemplateGalleryPageProps {
  categoryId: string | null; // null = все шаблоны
  onBack: () => void;
  onSelectTemplate: (template: StampTemplate) => void;
}

const ITEMS_PER_PAGE = 12;

export const TemplateGalleryPage = ({
  categoryId,
  onBack,
  onSelectTemplate,
}: TemplateGalleryPageProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Получаем шаблоны и загрузку
  const allTemplates = useTemplatesStore((state) => state.templates);
  const categories = useTemplatesStore((state) => state.categories);
  const getTemplatesByCategory = useTemplatesStore((state) => state.getTemplatesByCategory);
  const loadFromServer = useTemplatesStore((state) => state.loadFromServer);
  const isLoading = useTemplatesStore((state) => state.isLoading);

  // Загружаем данные при первом рендере
  useEffect(() => {
    loadFromServer();
  }, []);

  // Фильтруем шаблоны
  const templates = categoryId 
    ? getTemplatesByCategory(categoryId)
    : allTemplates;

  // Пагинация
  const totalPages = Math.ceil(templates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTemplates = templates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Название категории
  const getCategoryName = () => {
    if (!categoryId) return 'Все шаблоны';
    const cat = categories.find(c => c.id === categoryId);
    return cat?.name || 'Шаблоны';
  };

  // Генерация номеров страниц
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPages - 2) pages.push('...');
      
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div
      style={{
        height: '100%',
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9fafb',
        overflow: 'hidden',
      }}
    >
      {/* Заголовок */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
        >
          <ArrowLeft size={18} />
          Назад
        </button>
        
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
          {getCategoryName()}
        </h2>
      </div>

      {/* Пагинация сверху */}
      {totalPages > 1 && (
        <div
          style={{
            padding: '12px 24px',
            backgroundColor: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === 1 ? '#f9fafb' : '#fff',
              color: currentPage === 1 ? '#9ca3af' : '#374151',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ChevronLeft size={16} />
            Предыдущая
          </button>

          {getPageNumbers().map((page, idx) => (
            typeof page === 'number' ? (
              <button
                key={idx}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: '32px',
                  height: '32px',
                  fontSize: '13px',
                  border: '1px solid',
                  borderColor: currentPage === page ? '#0ea5e9' : '#d1d5db',
                  borderRadius: '6px',
                  backgroundColor: currentPage === page ? '#0ea5e9' : '#fff',
                  color: currentPage === page ? '#fff' : '#374151',
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ) : (
              <span key={idx} style={{ color: '#9ca3af' }}>•••</span>
            )
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: currentPage === totalPages ? '#f9fafb' : '#fff',
              color: currentPage === totalPages ? '#9ca3af' : '#374151',
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Следующая
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Счётчик */}
      <div style={{ padding: '8px 24px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
        {isLoading ? 'Загрузка...' : `Всего: ${templates.length}`}
      </div>

      {/* Сетка шаблонов */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 80px 24px' }}>
        {isLoading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6b7280',
            }}
          >
            <p style={{ fontSize: '16px', margin: 0 }}>Загрузка шаблонов...</p>
          </div>
        ) : templates.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9ca3af',
            }}
          >
            <p style={{ fontSize: '16px', margin: '0 0 8px' }}>Шаблоны не найдены</p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Добавьте шаблоны через панель администратора
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
            }}
          >
            {paginatedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={() => onSelectTemplate(template)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Карточка шаблона
interface TemplateCardProps {
  template: StampTemplate;
  onSelect: () => void;
}

const TemplateCard = ({ template, onSelect }: TemplateCardProps) => {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#0ea5e9';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Превью шаблона */}
      <div
        style={{
          aspectRatio: '1',
          backgroundColor: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {template.elements && template.elements.length > 0 ? (
          <TemplatePreview
            elements={template.elements}
            canvasSize={template.canvasSize}
            previewSize={180}
          />
        ) : template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <div
            style={{
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              border: '3px solid #0000ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              fontSize: '12px',
            }}
          >
            Превью
          </div>
        )}
      </div>

      {/* Кнопка */}
      <button
        onClick={onSelect}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '13px',
          fontWeight: '500',
          backgroundColor: '#0ea5e9',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0284c7'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
      >
        ◉ Открыть в конструкторе
      </button>
    </div>
  );
};
