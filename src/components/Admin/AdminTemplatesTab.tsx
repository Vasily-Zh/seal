import { useState } from 'react';
import { Trash2, Plus, Save } from 'lucide-react';
import { useTemplatesStore } from '../../store/useTemplatesStore';
import { useStampStore } from '../../store/useStampStore';
import { BUILT_IN_CATEGORIES } from '../../types/templates';

export const AdminTemplatesTab = () => {
  const [activeSection, setActiveSection] = useState<'categories' | 'templates' | 'generator'>('categories');
  
  // Store для шаблонов
  const categories = useTemplatesStore((state) => state.categories);
  const templates = useTemplatesStore((state) => state.templates);
  const generatorTemplates = useTemplatesStore((state) => state.generatorTemplates);
  const addCategory = useTemplatesStore((state) => state.addCategory);
  const deleteCategory = useTemplatesStore((state) => state.deleteCategory);
  const addTemplate = useTemplatesStore((state) => state.addTemplate);
  const deleteTemplate = useTemplatesStore((state) => state.deleteTemplate);
  const addGeneratorTemplate = useTemplatesStore((state) => state.addGeneratorTemplate);
  const deleteGeneratorTemplate = useTemplatesStore((state) => state.deleteGeneratorTemplate);
  
  // Store для текущего макета
  const currentElements = useStampStore((state) => state.elements);
  const canvasSize = useStampStore((state) => state.canvasSize);

  // Состояния форм
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryForTemplate, setSelectedCategoryForTemplate] = useState('');
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newGeneratorTemplateName, setNewGeneratorTemplateName] = useState('');
  const [generatorTemplateType, setGeneratorTemplateType] = useState<'ip' | 'ooo' | 'medical' | 'selfemployed' | 'custom'>('ooo');
  const [iconPositionX, setIconPositionX] = useState(50);
  const [iconPositionY, setIconPositionY] = useState(50);
  const [iconSize, setIconSize] = useState(15);

  // Все категории (встроенные + пользовательские)
  const allCategories = [...BUILT_IN_CATEGORIES, ...categories.filter(c => !c.isBuiltIn)];

  // Создание категории
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory({
      name: newCategoryName.trim(),
      order: allCategories.length,
    });
    setNewCategoryName('');
  };

  // Сохранение текущего макета как шаблон
  const handleSaveAsTemplate = () => {
    if (!selectedCategoryForTemplate || !newTemplateName.trim()) {
      alert('Выберите категорию и введите название');
      return;
    }
    if (currentElements.length === 0) {
      alert('Макет пуст. Сначала создайте макет в конструкторе.');
      return;
    }

    addTemplate({
      categoryId: selectedCategoryForTemplate,
      name: newTemplateName.trim(),
      elements: JSON.parse(JSON.stringify(currentElements)), // Deep clone
      canvasSize,
    });

    setNewTemplateName('');
    alert('Шаблон сохранён!');
  };

  // Сохранение текущего макета как базового для генератора
  const handleSaveAsGeneratorTemplate = () => {
    if (!newGeneratorTemplateName.trim()) {
      alert('Введите название шаблона');
      return;
    }
    if (currentElements.length === 0) {
      alert('Макет пуст. Сначала создайте макет в конструкторе.');
      return;
    }

    addGeneratorTemplate({
      name: newGeneratorTemplateName.trim(),
      type: generatorTemplateType,
      elements: JSON.parse(JSON.stringify(currentElements)),
      canvasSize,
      iconPosition: {
        x: iconPositionX,
        y: iconPositionY,
        size: iconSize,
      },
    });

    setNewGeneratorTemplateName('');
    alert('Базовый шаблон для генератора сохранён!');
  };

  return (
    <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
      {/* Подвкладки */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveSection('categories')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: activeSection === 'categories' ? '#3b82f6' : '#f3f4f6',
            color: activeSection === 'categories' ? '#fff' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Категории
        </button>
        <button
          onClick={() => setActiveSection('templates')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: activeSection === 'templates' ? '#3b82f6' : '#f3f4f6',
            color: activeSection === 'templates' ? '#fff' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Шаблоны ({templates.length})
        </button>
        <button
          onClick={() => setActiveSection('generator')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: activeSection === 'generator' ? '#3b82f6' : '#f3f4f6',
            color: activeSection === 'generator' ? '#fff' : '#374151',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Генератор ({generatorTemplates.length})
        </button>
      </div>

      {/* СЕКЦИЯ: Категории */}
      {activeSection === 'categories' && (
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', fontWeight: 600 }}>
            Категории шаблонов
          </h3>
          
          {/* Форма создания */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Название новой категории"
              style={{
                flex: 1,
                padding: '10px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
            />
            <button
              onClick={handleCreateCategory}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#10b981',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={18} />
              Создать
            </button>
          </div>

          {/* Список категорий */}
          <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            {allCategories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: cat.isBuiltIn ? '#f9fafb' : '#fff',
                }}
              >
                <span style={{ fontSize: '14px' }}>
                  {cat.name}
                  {cat.isBuiltIn && (
                    <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af' }}>
                      (встроенная)
                    </span>
                  )}
                </span>
                {!cat.isBuiltIn && (
                  <button
                    onClick={() => {
                      if (confirm(`Удалить категорию "${cat.name}"?`)) {
                        deleteCategory(cat.id);
                      }
                    }}
                    style={{
                      padding: '6px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* СЕКЦИЯ: Шаблоны */}
      {activeSection === 'templates' && (
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', fontWeight: 600 }}>
            Сохранить текущий макет как шаблон
          </h3>
          
          {/* Форма сохранения */}
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#f0fdf4', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #bbf7d0',
          }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <select
                value={selectedCategoryForTemplate}
                onChange={(e) => setSelectedCategoryForTemplate(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option value="">Выберите категорию</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Название шаблона"
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              onClick={handleSaveAsTemplate}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#10b981',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
              }}
            >
              <Save size={18} />
              Сохранить текущий макет
            </button>
          </div>

          {/* Список шаблонов */}
          <h4 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Сохранённые шаблоны
          </h4>
          {templates.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              Шаблоны пока не созданы
            </div>
          ) : (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {templates.map((tmpl) => {
                const cat = allCategories.find(c => c.id === tmpl.categoryId);
                return (
                  <div
                    key={tmpl.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{tmpl.name}</span>
                      <span style={{ marginLeft: '10px', fontSize: '12px', color: '#9ca3af' }}>
                        ({cat?.name || 'Без категории'})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Удалить шаблон "${tmpl.name}"?`)) {
                          deleteTemplate(tmpl.id);
                        }
                      }}
                      style={{
                        padding: '6px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* СЕКЦИЯ: Генератор */}
      {activeSection === 'generator' && (
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', fontWeight: 600 }}>
            Базовые шаблоны для генератора
          </h3>
          
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '15px' }}>
            Создайте макет печати в конструкторе, оставьте место в центре для иконки, затем сохраните здесь как базовый шаблон.
          </p>

          {/* Форма сохранения */}
          <div style={{ 
            padding: '16px', 
            backgroundColor: '#fef3c7', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #fcd34d',
          }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={newGeneratorTemplateName}
                onChange={(e) => setNewGeneratorTemplateName(e.target.value)}
                placeholder="Название (напр. ООО стандартный)"
                style={{
                  flex: '1 1 200px',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
              <select
                value={generatorTemplateType}
                onChange={(e) => setGeneratorTemplateType(e.target.value as any)}
                style={{
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              >
                <option value="ip">ИП</option>
                <option value="ooo">ООО</option>
                <option value="medical">Медицинская</option>
                <option value="selfemployed">Самозанятый</option>
                <option value="custom">Другое</option>
              </select>
            </div>

            {/* Позиция иконки */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '8px' }}>
                Позиция иконки в центре (X, Y, размер в мм):
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="number"
                  value={iconPositionX}
                  onChange={(e) => setIconPositionX(Number(e.target.value))}
                  placeholder="X"
                  style={{
                    width: '80px',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
                <input
                  type="number"
                  value={iconPositionY}
                  onChange={(e) => setIconPositionY(Number(e.target.value))}
                  placeholder="Y"
                  style={{
                    width: '80px',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
                <input
                  type="number"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                  placeholder="Размер"
                  style={{
                    width: '80px',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleSaveAsGeneratorTemplate}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: '#f59e0b',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
              }}
            >
              <Save size={18} />
              Сохранить как базовый шаблон
            </button>
          </div>

          {/* Список базовых шаблонов */}
          <h4 style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
            Сохранённые базовые шаблоны
          </h4>
          {generatorTemplates.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              Базовые шаблоны пока не созданы
            </div>
          ) : (
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
              {generatorTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{tmpl.name}</span>
                    <span style={{ marginLeft: '10px', fontSize: '12px', color: '#9ca3af' }}>
                      ({tmpl.type.toUpperCase()})
                    </span>
                    <span style={{ marginLeft: '10px', fontSize: '11px', color: '#6b7280' }}>
                      Иконка: {tmpl.iconPosition.x}x{tmpl.iconPosition.y}, {tmpl.iconPosition.size}мм
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Удалить базовый шаблон "${tmpl.name}"?`)) {
                        deleteGeneratorTemplate(tmpl.id);
                      }
                    }}
                    style={{
                      padding: '6px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
