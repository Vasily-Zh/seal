import { useState, useEffect, useRef } from 'react';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  addIcon,
  deleteIcon,
  getCustomIconSettings,
  exportCategoriesToJSON,
  importCategoriesFromJSON,
  getStorageSize,
  isCategoryNameExists,
  hideBuiltinCategory,
  showBuiltinCategory,
  getHiddenBuiltinCategories,
  hideBuiltinIcon,
  addIconToBuiltinCategory,
  deleteIconFromBuiltinCategory,
} from '../../utils/customIcons';
import { getAllCategories } from '../../data/iconCollections';
import * as LucideIcons from 'lucide-react';
import * as HeroIcons from '@heroicons/react/24/solid';
import { changeCredentials, logout, getCurrentAdminLogin } from '../../utils/auth';
import { processSVG, readSVGFile } from '../../utils/svgValidator';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  needsPasswordChange: boolean;
}

type Tab = 'categories' | 'settings';

// Универсальный тип для отображения категорий
interface DisplayCategory {
  id: string;
  name: string;
  icons: Array<{
    id: string;
    name: string;
    displayName: string;
    svgContent?: string;
    source?: 'lucide' | 'heroicons' | 'custom';
  }>;
  isCustom: boolean;
}

export const AdminPanel = ({ isOpen, onClose, needsPasswordChange: initialNeedsPasswordChange }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<Tab>(initialNeedsPasswordChange ? 'settings' : 'categories');
  const [categories, setCategories] = useState<DisplayCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(initialNeedsPasswordChange);

  // Состояния для модальных окон
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isRenamingCategory, setIsRenamingCategory] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [error, setError] = useState('');

  // Состояния для настроек
  const [currentPassword, setCurrentPassword] = useState('');
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Ref для file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загрузка категорий
  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = () => {
    // Получаем все категории (библиотечные + кастомные)
    const allCategories = getAllCategories();

    // Конвертируем их в DisplayCategory синхронно
    const displayCategories: DisplayCategory[] = allCategories.map((cat) => {
      const icons = cat.icons.map((icon) => {
        return {
          id: icon.name || '', // Для библиотечных иконок используем name как id
          name: icon.name || '',
          displayName: icon.displayName || '',
          svgContent: icon.svgContent || '',
          source: icon.source,
        };
      });

      return {
        id: cat.id,
        name: cat.name,
        icons: icons,
        isCustom: cat.isCustom || false,
      };
    });

    setCategories(displayCategories);
    if (displayCategories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(displayCategories[0].id);
    }
  };

  const handleCreateCategory = () => {
    if (!categoryNameInput.trim()) {
      setError('Введите название категории');
      return;
    }

    if (isCategoryNameExists(categoryNameInput.trim())) {
      setError('Категория с таким названием уже существует');
      return;
    }

    const newCategory = addCategory(categoryNameInput.trim());
    setCategories(prev => [{ ...newCategory, isCustom: true }, ...prev]);
    setSelectedCategoryId(newCategory.id);
    setIsCreatingCategory(false);
    setCategoryNameInput('');
    setError('');
  };

  const handleRenameCategory = () => {
    if (!selectedCategoryId) return;

    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category || !category.isCustom) {
      setError('Нельзя переименовать библиотечную категорию');
      return;
    }

    if (!categoryNameInput.trim()) {
      setError('Введите название категории');
      return;
    }

    if (isCategoryNameExists(categoryNameInput.trim(), selectedCategoryId)) {
      setError('Категория с таким названием уже существует');
      return;
    }

    const success = updateCategory(selectedCategoryId, categoryNameInput.trim());
    if (success) {
      loadCategories();
      setIsRenamingCategory(false);
      setCategoryNameInput('');
      setError('');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    // Для встроенных категорий - скрываем, для кастомных - удаляем
    if (!category.isCustom) {
      const confirmHide = window.confirm(
        `Скрыть встроенную категорию "${category.name}"?\n\nВы сможете восстановить её позже через настройки.`
      );

      if (!confirmHide) return;

      const success = hideBuiltinCategory(categoryId);
      if (success) {
        loadCategories();
        if (selectedCategoryId === categoryId) {
          const newCategories = categories.filter(c => c.id !== categoryId);
          setSelectedCategoryId(newCategories.length > 0 ? newCategories[0].id : null);
        }
      }
    } else {
      const confirmDelete = window.confirm(
        category.icons.length > 0
          ? `Удалить категорию "${category.name}"? В ней ${category.icons.length} иконок.`
          : `Удалить категорию "${category.name}"?`
      );

      if (!confirmDelete) return;

      const success = deleteCategory(categoryId);
      if (success) {
        loadCategories();
        if (selectedCategoryId === categoryId) {
          const newCategories = categories.filter(c => c.id !== categoryId);
          setSelectedCategoryId(newCategories.length > 0 ? newCategories[0].id : null);
        }
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCategoryId) return;

    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.includes('svg')) {
        alert(`Файл "${file.name}" не является SVG`);
        continue;
      }

      try {
        const svgContent = await readSVGFile(file);
        const processed = processSVG(svgContent);

        if (!processed.success) {
          alert(`Ошибка в файле "${file.name}": ${processed.error}`);
          continue;
        }

        if (processed.warnings && processed.warnings.length > 0) {
          console.warn(`Предупреждения для "${file.name}":`, processed.warnings);
        }

        // Генерация имени на основе имени файла
        const baseName = file.name.replace('.svg', '');
        const name = baseName.toLowerCase().replace(/\s+/g, '-');

        // Для встроенных категорий используем addIconToBuiltinCategory
        // Для кастомных - addIcon
        const newIcon = category.isCustom
          ? addIcon(selectedCategoryId, name, baseName, processed.svg!)
          : addIconToBuiltinCategory(selectedCategoryId, name, baseName, processed.svg!);

        if (newIcon) {
          loadCategories();
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        alert(`Не удалось загрузить файл "${file.name}"`);
      }
    }

    // Сброс input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteIcon = (iconId: string, iconName: string, iconSource?: string) => {
    if (!selectedCategoryId) return;

    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const confirmDelete = window.confirm('Удалить эту иконку?');
    if (!confirmDelete) return;

    let success = false;

    // Для встроенных библиотечных иконок - скрываем
    if (!category.isCustom && (iconSource === 'lucide' || iconSource === 'heroicons')) {
      success = hideBuiltinIcon(selectedCategoryId, iconName);
    }
    // Для пользовательских иконок в кастомных категориях - удаляем
    else if (category.isCustom) {
      success = deleteIcon(selectedCategoryId, iconId);
    }
    // Для пользовательских иконок во встроенных категориях - удаляем
    else if (!category.isCustom && iconSource === 'custom') {
      success = deleteIconFromBuiltinCategory(selectedCategoryId, iconId);
    }

    if (success) {
      loadCategories();
    }
  };

  const handleExport = () => {
    const json = exportCategoriesToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-icons-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const content = await file.text();
        const success = importCategoriesFromJSON(content, false);
        if (success) {
          loadCategories();
          alert('Категории успешно импортированы');
        } else {
          alert('Ошибка импорта категорий');
        }
      } catch (err) {
        console.error('Import error:', err);
        alert('Не удалось импортировать файл');
      }
    };
    input.click();
  };

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (!currentPassword) {
      setSettingsError('Введите текущий пароль');
      return;
    }

    if (!newLogin && !newPassword) {
      setSettingsError('Введите новый логин или новый пароль');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSettingsError('Пароли не совпадают');
      return;
    }

    try {
      const result = await changeCredentials(
        currentPassword,
        newLogin || undefined,
        newPassword || undefined
      );

      if (result.success) {
        setSettingsSuccess('Креденшалы успешно обновлены');
        setCurrentPassword('');
        setNewLogin('');
        setNewPassword('');
        setConfirmPassword('');
        setNeedsPasswordChange(false);
      } else {
        setSettingsError(result.error || 'Ошибка смены креденшалов');
      }
    } catch (err) {
      console.error('Change credentials error:', err);
      setSettingsError('Произошла ошибка');
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const settings = getCustomIconSettings();
  const storageSize = getStorageSize();

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
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '1000px',
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 30px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Админ-панель</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Админ: {getCurrentAdminLogin()}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Выйти
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                color: '#666',
              }}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        </div>

        {/* Warning if password needs changing */}
        {needsPasswordChange && (
          <div
            style={{
              padding: '12px 30px',
              backgroundColor: '#fef3c7',
              borderLeft: '4px solid #f59e0b',
              color: '#92400e',
              fontSize: '14px',
            }}
          >
            <strong>Внимание:</strong> Вы используете пароль по умолчанию. Пожалуйста, смените его во вкладке "Настройки".
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', padding: '0 30px' }}>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'categories' ? 600 : 400,
              color: activeTab === 'categories' ? '#3b82f6' : '#666',
              borderBottom: activeTab === 'categories' ? '2px solid #3b82f6' : '2px solid transparent',
            }}
          >
            Категории и SVG
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'settings' ? 600 : 400,
              color: activeTab === 'settings' ? '#3b82f6' : '#666',
              borderBottom: activeTab === 'settings' ? '2px solid #3b82f6' : '2px solid transparent',
            }}
          >
            Настройки
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'categories' ? (
            <div style={{ display: 'flex', height: '100%' }}>
              {/* Список категорий */}
              <div
                style={{
                  width: '250px',
                  borderRight: '1px solid #e5e7eb',
                  padding: '20px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ marginBottom: '15px' }}>
                  <button
                    onClick={() => {
                      setIsCreatingCategory(true);
                      setCategoryNameInput('');
                      setError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px dashed #3b82f6',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      color: '#3b82f6',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    + Создать категорию
                  </button>
                </div>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: selectedCategoryId === category.id ? '#eff6ff' : 'transparent',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: category.isCustom ? '1px solid transparent' : '1px solid #e5e7eb',
                    }}
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {category.name}
                        {!category.isCustom && (
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              backgroundColor: '#f3f4f6',
                              color: '#666',
                              borderRadius: '3px',
                              fontWeight: 400,
                            }}
                            title="Встроенная категория"
                          >
                            встроенная
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {category.icons.length} иконок
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {category.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategoryId(category.id);
                            setCategoryNameInput(category.name);
                            setIsRenamingCategory(true);
                            setError('');
                          }}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '3px',
                            backgroundColor: '#f3f4f6',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                          title="Переименовать"
                        >
                          ✏
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category.id);
                        }}
                        style={{
                          padding: '4px 8px',
                          border: 'none',
                          borderRadius: '3px',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                        title={category.isCustom ? 'Удалить' : 'Скрыть категорию'}
                      >
                        {category.isCustom ? '🗑' : '👁‍🗨'}
                      </button>
                    </div>
                  </div>
                ))}

                {categories.length === 0 && (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: '14px', marginTop: '20px' }}>
                    Нет категорий
                  </div>
                )}
              </div>

              {/* SVG-файлы */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                {selectedCategory ? (
                  <>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                        {selectedCategory.name}
                        {!selectedCategory.isCustom && (
                          <span style={{ fontSize: '14px', fontWeight: 400, color: '#666', marginLeft: '10px' }}>
                            (встроенная категория)
                          </span>
                        )}
                      </h3>
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".svg"
                          multiple
                          onChange={handleFileUpload}
                          style={{ display: 'none' }}
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          + Загрузить SVG
                        </button>
                      </div>
                    </div>

                    {selectedCategory.icons.length > 0 ? (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                          gap: '15px',
                        }}
                      >
                        {selectedCategory.icons.map((icon) => {
                          // Для библиотечных иконок рендерим React-компоненты
                          let IconComponent = null;
                          if (icon.source === 'lucide') {
                            IconComponent = (LucideIcons as any)[icon.name];
                          } else if (icon.source === 'heroicons') {
                            IconComponent = (HeroIcons as any)[icon.name];
                          }

                          return (
                            <div
                              key={icon.id}
                              style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: '6px',
                                padding: '15px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '10px',
                              }}
                            >
                              <div
                                style={{
                                  width: '60px',
                                  height: '60px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {IconComponent ? (
                                  <IconComponent size={48} strokeWidth={1.5} />
                                ) : icon.svgContent ? (
                                  <div dangerouslySetInnerHTML={{ __html: icon.svgContent }} />
                                ) : (
                                  <div style={{ color: '#ccc' }}>?</div>
                                )}
                              </div>
                              <div style={{ fontSize: '12px', textAlign: 'center', width: '100%', wordWrap: 'break-word' }}>
                                {icon.displayName}
                              </div>
                              <button
                                onClick={() => handleDeleteIcon(icon.id, icon.name, icon.source)}
                                style={{
                                  padding: '5px 10px',
                                  border: 'none',
                                  borderRadius: '3px',
                                  backgroundColor: '#fee2e2',
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  width: '100%',
                                }}
                              >
                                Удалить
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', color: '#999', fontSize: '14px', marginTop: '40px' }}>
                        {selectedCategory.isCustom
                          ? 'В этой категории пока нет иконок. Загрузите SVG-файлы.'
                          : 'В этой категории пока нет иконок.'}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: '#999', fontSize: '14px', marginTop: '40px' }}>
                    Выберите категорию или создайте новую
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', overflowY: 'auto' }}>
              {/* Смена креденшалов */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                  Смена логина и пароля
                </h3>
                <form onSubmit={handleChangeCredentials} style={{ maxWidth: '400px' }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 500 }}>
                      Текущий пароль
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      autoComplete="current-password"
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 500 }}>
                      Новый логин (опционально)
                    </label>
                    <input
                      type="text"
                      value={newLogin}
                      onChange={(e) => setNewLogin(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      autoComplete="username"
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 500 }}>
                      Новый пароль (опционально)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      autoComplete="new-password"
                    />
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 500 }}>
                      Подтвердите новый пароль
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      autoComplete="new-password"
                    />
                  </div>

                  {settingsError && (
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: '#fee',
                        color: '#c33',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '14px',
                      }}
                    >
                      {settingsError}
                    </div>
                  )}

                  {settingsSuccess && (
                    <div
                      style={{
                        padding: '10px',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '14px',
                      }}
                    >
                      {settingsSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Сохранить изменения
                  </button>
                </form>
              </div>

              {/* Экспорт/Импорт */}
              <div style={{ marginBottom: '30px', paddingTop: '30px', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                  Экспорт и импорт
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleExport}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Экспортировать все категории (JSON)
                  </button>
                  <button
                    onClick={handleImport}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    Импортировать категории (JSON)
                  </button>
                </div>
              </div>

              {/* Статистика */}
              <div style={{ paddingTop: '30px', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                  Статистика
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '600px' }}>
                  <div style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#3b82f6' }}>
                      {settings.totalCategories}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>Категорий</div>
                  </div>
                  <div style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#10b981' }}>
                      {settings.totalIcons}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>Иконок</div>
                  </div>
                  <div style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: '#f59e0b' }}>
                      {storageSize.percentage.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                      Использовано ({storageSize.megabytes.toFixed(2)} МБ)
                    </div>
                  </div>
                </div>
              </div>

              {/* Восстановление скрытых категорий */}
              <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
                  Восстановление скрытых категорий
                </h3>
                {(() => {
                  const hiddenCategories = getHiddenBuiltinCategories();

                  if (hiddenCategories.length === 0) {
                    return (
                      <div style={{ color: '#666', fontSize: '14px' }}>
                        Нет скрытых категорий
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {hiddenCategories.map((categoryId) => (
                        <button
                          key={categoryId}
                          onClick={() => {
                            showBuiltinCategory(categoryId);
                            loadCategories();
                          }}
                          style={{
                            padding: '8px 16px',
                            border: '1px solid #3b82f6',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            color: '#3b82f6',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span>↺</span>
                          {/* Найти название категории по ID */}
                          {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно создания категории */}
      {isCreatingCategory && (
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
            zIndex: 1001,
          }}
          onClick={() => setIsCreatingCategory(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
              Создать категорию
            </h3>
            <input
              type="text"
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateCategory();
                if (e.key === 'Escape') setIsCreatingCategory(false);
              }}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                marginBottom: '15px',
              }}
              placeholder="Название категории"
              autoFocus
            />
            {error && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#fee',
                  color: '#c33',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsCreatingCategory(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleCreateCategory}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно переименования категории */}
      {isRenamingCategory && (
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
            zIndex: 1001,
          }}
          onClick={() => setIsRenamingCategory(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '25px',
              borderRadius: '8px',
              width: '400px',
              maxWidth: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', fontWeight: 600 }}>
              Переименовать категорию
            </h3>
            <input
              type="text"
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameCategory();
                if (e.key === 'Escape') setIsRenamingCategory(false);
              }}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                marginBottom: '15px',
              }}
              placeholder="Новое название"
              autoFocus
            />
            {error && (
              <div
                style={{
                  padding: '10px',
                  backgroundColor: '#fee',
                  color: '#c33',
                  borderRadius: '4px',
                  marginBottom: '15px',
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsRenamingCategory(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleRenameCategory}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
