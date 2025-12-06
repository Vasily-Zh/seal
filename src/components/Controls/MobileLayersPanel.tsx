import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'; 
import { CSS } from '@dnd-kit/utilities';
import {
  Trash2,
  ChevronRight,
  ChevronDown,
  Circle,
  Type,
  Square,
  Image as ImageIcon,
  Layers,
  Copy,
  ChevronDown as ChevronDownIcon,
} from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import type { StampElement } from '../../types';

// Компонент для отображения одного элемента в списке слоёв
interface LayerItemProps {
  element: StampElement;
  isSelected: boolean;
  isChild: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

const SortableLayerItem = ({ element, ...props }: LayerItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <LayerItem element={element} dragHandleProps={listeners} {...props} />
    </div>
  );
};

const LayerItem = ({
  element,
  isSelected,
  isChild,
  onSelect,
  onDuplicate,
  onDelete,
  onToggleExpand,
  isExpanded,
  dragHandleProps,
}: LayerItemProps & { dragHandleProps?: any }) => {
  const getElementIcon = () => {
    switch (element.type) {
      case 'circle':
        return <Circle size={16} />;
      case 'text':
      case 'textCentered':
        return <Type size={16} />;
      case 'rectangle':
      case 'triangle':
        return <Square size={16} />;
      case 'image':
      case 'icon':
        return <ImageIcon size={16} />;
      case 'group':
        return <Layers size={16} />;
      default:
        return null;
    }
  };

  const getElementName = () => {
    if (element.type === 'group') {
      return element.name;
    }
    if (element.type === 'text' || element.type === 'textCentered') {
      return element.text || 'Текст';
    }
    const typeNames: Record<string, string> = {
      circle: 'Круг',
      rectangle: 'Прямоугольник',
      triangle: 'Треугольник',
      line: 'Линия',
      image: 'Изображение',
      icon: 'Иконка',
    };
    return typeNames[element.type] || element.type;
  };

  return (
    <div
      style={{
        padding: '8px 12px',
        paddingLeft: isChild ? '32px' : '12px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: isSelected ? '#dbeafe' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <div {...dragHandleProps} style={{ cursor: 'grab', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '4px', height: '16px', background: '#9ca3af', borderRadius: '2px', marginRight: '2px' }} />
        <div style={{ width: '4px', height: '16px', background: '#9ca3af', borderRadius: '2px' }} />
      </div>

      {/* Expand/Collapse для групп */}
      {element.type === 'group' && onToggleExpand && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      )}

      {/* Иконка типа элемента */}
      <div style={{ color: '#6b7280', display: 'flex', alignItems: 'center' }}>
        {getElementIcon()}
      </div>

      {/* Название элемента */}
      <div style={{ flex: 1, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {getElementName()}
      </div>

      {/* Кнопки управления */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {/* Блокировка */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: element.locked ? '#ef4444' : '#6b7280',
          }}
          title={element.locked ? 'Разблокировать' : 'Заблокировать'}
        >
          {element.locked ? <Lock size={16} /> : <Unlock size={16} />}
        </button> */}

        {/* Дублирование */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#6b7280',
          }}
          title="Дублировать"
        >
          <Copy size={16} />
        </button>

        {/* Видимость */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: element.visible ? '#6b7280' : '#ef4444',
          }}
          title={element.visible ? 'Скрыть' : 'Показать'}
        >
          {element.visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button> */}

        {/* Удаление */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#ef4444',
          }}
          title="Удалить"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export const MobileLayersPanel = () => {
  const elements = useStampStore((state) => state.elements);
  const selectedElementId = useStampStore((state) => state.selectedElementId);
  const selectElement = useStampStore((state) => state.selectElement);
  const updateElement = useStampStore((state) => state.updateElement);
  const removeElement = useStampStore((state) => state.removeElement);
  const duplicateElement = useStampStore((state) => state.duplicateElement);
  const toggleElementLock = useStampStore((state) => state.toggleElementLock);
  const reorderElements = useStampStore((state) => state.reorderElements);
  const expandGroup = useStampStore((state) => state.expandGroup);
  const createGroup = useStampStore((state) => state.createGroup);
  const ungroupElements = useStampStore((state) => state.ungroupElements);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = elements.findIndex((el) => el.id === active.id);
      const newIndex = elements.findIndex((el) => el.id === over.id);

      const newOrder = arrayMove(elements, oldIndex, newIndex);
      reorderElements(newOrder.map((el) => el.id));
    }
  };

  // Фильтруем элементы верхнего уровня (без parentId)
  const topLevelElements = elements.filter((el) => !el.parentId);

  // Функция для получения дочерних элементов группы
  const getGroupChildren = (groupId: string): StampElement[] => {
    const group = elements.find((el) => el.id === groupId && el.type === 'group');
    if (!group || group.type !== 'group') return [];

    return elements.filter((el) => group.children.includes(el.id));
  };

  const handleGroupSelected = () => {
    if (selectedItems.size < 2) {
      alert('Выберите хотя бы 2 элемента для группировки');
      return;
    }
    createGroup(Array.from(selectedItems));
    setSelectedItems(new Set());
  };

  // Получаем название выбранного элемента
  const getSelectedElementName = (): string => {
    if (!selectedElementId) return 'Элементы';
    const selected = elements.find(el => el.id === selectedElementId);
    if (!selected) return 'Элементы';
    
    if (selected.type === 'group') {
      return selected.name || 'Группа';
    }
    if (selected.type === 'text' || selected.type === 'textCentered') {
      const text = selected.text || 'Текст';
      return text.length > 20 ? text.substring(0, 20) + '...' : text;
    }
    const typeNames: Record<string, string> = {
      circle: 'Круг',
      rectangle: 'Прямоугольник',
      triangle: 'Треугольник',
      line: 'Линия',
      image: 'Изображение',
      icon: 'Иконка',
    };
    return typeNames[selected.type] || 'Элемент';
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} className="mobile-dropdown">
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: selectedElementId ? '#dbeafe' : '#e0f2fe',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        className="touch-optimized"
      >
        <span style={{ 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#0369a1',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>{getSelectedElementName()}</span>
        <ChevronDownIcon size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            maxHeight: '400px',
            overflowY: 'auto',
            marginTop: '4px',
          }}
        >
          {/* Кнопки управления группами */}
          {selectedItems.size > 0 && (
            <div style={{ padding: '8px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <button
                onClick={handleGroupSelected}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                className="touch-optimized"
              >
                Сгруппировать выбранное ({selectedItems.size})
              </button>
            </div>
          )}

          {/* Список слоёв с drag-and-drop */}
          {topLevelElements.length === 0 ? (
            <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af' }}>
              Нет элементов
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={topLevelElements.map((el) => el.id)} strategy={verticalListSortingStrategy}>
                {topLevelElements.map((element) => (
                  <div key={element.id}>
                    <SortableLayerItem
                      element={element}
                      isSelected={selectedElementId === element.id}
                      isChild={false}
                      onSelect={() => {
                        selectElement(element.id);
                        setIsOpen(false);
                      }}
                      onToggleVisibility={() => updateElement(element.id, { visible: !element.visible })}
                      onToggleLock={() => toggleElementLock(element.id)}
                      onDuplicate={() => duplicateElement(element.id)}
                      onDelete={() => {
                        if (element.type === 'group') {
                          if (confirm('Удалить группу? Дочерные элементы останутся.')) {
                            ungroupElements(element.id);
                          }
                        } else {
                          removeElement(element.id);
                        }
                      }}
                      onToggleExpand={
                        element.type === 'group'
                          ? () => expandGroup(element.id, !element.expanded)
                          : undefined
                      }
                      isExpanded={element.type === 'group' ? element.expanded : undefined}
                    />

                    {/* Дочерние элементы группы */}
                    {element.type === 'group' && element.expanded && (
                      <div>
                        {getGroupChildren(element.id).map((child) => (
                          <LayerItem
                            key={child.id}
                            element={child}
                            isSelected={selectedElementId === child.id}
                            isChild={true}
                            onSelect={() => {
                              selectElement(child.id);
                              setIsOpen(false);
                            }}
                            onToggleVisibility={() => updateElement(child.id, { visible: !child.visible })}
                            onToggleLock={() => toggleElementLock(child.id)}
                            onDuplicate={() => duplicateElement(child.id)}
                            onDelete={() => removeElement(child.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </div>
  );
};