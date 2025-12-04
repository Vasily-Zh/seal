import { useState, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react';
import { useTemplatesStore } from '../../store/useTemplatesStore';
import { iconTagsMap } from '../../data/iconTags';
import { allIcons } from '../../data/allIcons';
import type { GeneratorBaseTemplate } from '../../types/templates';
import type { StampElement, IconElement } from '../../types';
import * as LucideIcons from 'lucide-react';

interface GeneratorPageProps {
  onBack: () => void;
  onSelectGenerated: (elements: StampElement[], canvasSize: number) => void;
}

const ITEMS_PER_PAGE = 12;

export const GeneratorPage = ({ onBack, onSelectGenerated }: GeneratorPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Получаем базовые шаблоны генератора
  const generatorTemplates = useTemplatesStore((state) => state.generatorTemplates);
  const iconTags = useTemplatesStore((state) => state.iconTags);

  // Выбранный базовый шаблон
  const selectedTemplate = generatorTemplates.find(t => t.id === selectedTemplateId);

  // Поиск иконок по тегу
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    const results: Array<{ name: string; source: 'lucide' | 'heroicons'; displayName: string }> = [];

    for (const icon of allIcons) {
      // Проверяем теги из store
      const storeTags = iconTags[icon.name] || [];
      // Проверяем теги из базового словаря
      const baseTags = iconTagsMap[icon.name] || [];
      // Объединяем все теги
      const allTags = [...storeTags, ...baseTags, icon.displayName.toLowerCase()];

      const matches = allTags.some(tag => tag.toLowerCase().includes(query));

      if (matches) {
        results.push({
          name: icon.name,
          source: icon.source,
          displayName: icon.displayName,
        });
      }
    }

    return results;
  }, [searchQuery, iconTags]);

  // Пагинация
  const totalPages = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedResults = searchResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Сброс страницы при новом поиске
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Генерация макета с иконкой
  const handleSelectIcon = (iconName: string, iconSource: 'lucide' | 'heroicons') => {
    if (!selectedTemplate) {
      alert('Сначала выберите базовый шаблон');
      return;
    }

    // Клонируем элементы шаблона
    const newElements: StampElement[] = selectedTemplate.elements.map(el => ({
      ...el,
      id: `${el.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    // Создаём иконку в центре
    const iconElement: IconElement = {
      id: `icon-${Date.now()}`,
      type: 'icon',
      iconName,
      iconSource,
      x: selectedTemplate.iconPosition.x,
      y: selectedTemplate.iconPosition.y,
      width: selectedTemplate.iconPosition.size,
      height: selectedTemplate.iconPosition.size,
      visible: true,
      fill: '#0000ff',
    };

    // Добавляем иконку к элементам
    newElements.push(iconElement);

    onSelectGenerated(newElements, selectedTemplate.canvasSize);
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
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f9fafb',
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
          }}
        >
          <ArrowLeft size={18} />
          Назад
        </button>

        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>
          Генератор печатей
        </h2>
      </div>

      {/* Описание */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
          Введите в поле ниже что должно быть изображено на печати, а генератор создаст варианты!
        </p>
      </div>

      {/* Панель поиска и выбора шаблона */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-end',
        }}
      >
        {/* Выбор базового шаблона */}
        <div style={{ width: '250px', position: 'relative' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px',
            }}
          >
            Базовый шаблон
          </label>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: selectedTemplate ? '#111827' : '#9ca3af' }}>
              {selectedTemplate?.name || 'Выберите шаблон'}
            </span>
            <ChevronDown size={18} color="#6b7280" />
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                backgroundColor: '#fff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 100,
                maxHeight: '200px',
                overflow: 'auto',
              }}
            >
              {generatorTemplates.length === 0 ? (
                <div style={{ padding: '12px', color: '#9ca3af', fontSize: '13px' }}>
                  Нет базовых шаблонов. Добавьте через админку.
                </div>
              ) : (
                generatorTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: 'none',
                      backgroundColor: selectedTemplateId === template.id ? '#f0f9ff' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {template.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Поле поиска */}
        <div style={{ flex: 1 }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px',
            }}
          >
            Ключевые слова
          </label>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              color="#9ca3af"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Художник, строитель, врач..."
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </div>

      {/* Пагинация и счётчик */}
      {searchResults.length > 0 && (
        <>
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

          <div style={{ padding: '8px 24px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>
            Всего: {searchResults.length}
          </div>
        </>
      )}

      {/* Результаты */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
        {!searchQuery.trim() ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <p style={{ fontSize: '16px', margin: '0 0 8px' }}>Введите ключевое слово для поиска</p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Например: врач, строитель, художник, юрист
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <p style={{ fontSize: '16px', margin: '0 0 8px' }}>Ничего не найдено</p>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Попробуйте другое ключевое слово
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
            {paginatedResults.map((icon) => (
              <GeneratedCard
                key={icon.name}
                iconName={icon.name}
                iconSource={icon.source}
                displayName={icon.displayName}
                template={selectedTemplate}
                onSelect={() => handleSelectIcon(icon.name, icon.source)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Карточка сгенерированного результата
interface GeneratedCardProps {
  iconName: string;
  iconSource: 'lucide' | 'heroicons';
  displayName: string;
  template: GeneratorBaseTemplate | undefined;
  onSelect: () => void;
}

const GeneratedCard = ({ iconName, iconSource, template, onSelect }: GeneratedCardProps) => {
  // Динамический импорт иконки для превью

  
    const IconComponent = useMemo(() => {
    if (iconSource === 'lucide') {
      return LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
    }
    return null;
  }, [iconName, iconSource]);


  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        transition: 'all 0.2s',
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
      {/* Превью */}
      <div
        style={{
          aspectRatio: '1',
          backgroundColor: '#f9fafb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          position: 'relative',
        }}
      >
        {/* Круг печати (упрощённый) */}
        <div
          style={{
            width: '85%',
            height: '85%',
            borderRadius: '50%',
            border: '3px solid #0000ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Внутренний круг */}
          <div
            style={{
              width: '75%',
              height: '75%',
              borderRadius: '50%',
              border: '2px solid #0000ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Иконка */}
            {IconComponent && (
              <IconComponent size={40} color="#0000ff" strokeWidth={1.5} />
            )}
          </div>
        </div>
      </div>

      {/* Кнопка */}
      <button
        onClick={onSelect}
        disabled={!template}
        style={{
          width: '100%',
          padding: '12px',
          fontSize: '13px',
          fontWeight: '500',
          backgroundColor: template ? '#0ea5e9' : '#9ca3af',
          color: '#fff',
          border: 'none',
          cursor: template ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => template && (e.currentTarget.style.backgroundColor = '#0284c7')}
        onMouseLeave={(e) => template && (e.currentTarget.style.backgroundColor = '#0ea5e9')}
      >
        ◉ Открыть в конструкторе
      </button>
    </div>
  );
};
