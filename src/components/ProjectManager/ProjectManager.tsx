import { useState, useEffect, useRef } from 'react';
import { X, Download, Upload, Trash2, FolderOpen, Search } from 'lucide-react';
import {
  listProjects,
  loadProject,
  deleteProject,
  exportProjectAsJSON,
  importProjectFromJSON,
  type StampProject,
} from '../../utils/projectStorage';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadProject: (project: StampProject) => void;
}

export const ProjectManager = ({ isOpen, onClose, onLoadProject }: ProjectManagerProps) => {
  const [projects, setProjects] = useState<ReturnType<typeof listProjects>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загрузить список проектов при открытии
  useEffect(() => {
    if (isOpen) {
      refreshProjects();
    }
  }, [isOpen]);

  const refreshProjects = () => {
    setProjects(listProjects());
  };

  const handleLoadProject = (projectId: string) => {
    const project = loadProject(projectId);
    if (project) {
      onLoadProject(project);
      onClose();
    } else {
      alert('Не удалось загрузить проект');
    }
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (confirm(`Удалить проект "${projectName}"?`)) {
      try {
        deleteProject(projectId);
        refreshProjects();
      } catch (error) {
        alert('Не удалось удалить проект');
      }
    }
  };

  const handleExportProject = (projectId: string) => {
    try {
      exportProjectAsJSON(projectId);
    } catch (error) {
      alert('Не удалось экспортировать проект');
    }
  };

  const handleImportProject = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importProjectFromJSON(file);
      refreshProjects();
      alert('Проект успешно импортирован!');
    } catch (error) {
      alert((error as Error).message || 'Не удалось импортировать проект');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Фильтрация проектов по поисковому запросу
  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          borderRadius: '12px',
          width: '90%',
          maxWidth: '800px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '2px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: '#111827' }}>
              Мои проекты
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0' }}>
              {projects.length} проект(ов) сохранено
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              color: '#6b7280',
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Import */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
            {/* Search */}
            <div style={{ flex: 1, position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                }}
              />
              <input
                type="text"
                placeholder="Поиск проектов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Import Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              style={{
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isImporting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isImporting ? 0.6 : 1,
              }}
            >
              <Upload size={16} />
              {isImporting ? 'Импорт...' : 'Импорт'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportProject}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Projects List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {filteredProjects.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#9ca3af',
              }}
            >
              <FolderOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '16px', fontWeight: '500' }}>
                {searchQuery ? 'Проекты не найдены' : 'Нет сохранённых проектов'}
              </p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                {searchQuery
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Сохраните текущий проект, чтобы он появился здесь'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleLoadProject(project.id)}
                    style={{
                      width: '100%',
                      height: '160px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <FolderOpen size={48} color="#d1d5db" />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '12px' }}>
                    <h3
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        margin: '0 0 6px',
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={project.name}
                    >
                      {project.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px' }}>
                      {new Date(project.updatedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleLoadProject(project.id)}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        Открыть
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportProject(project.id);
                        }}
                        style={{
                          padding: '6px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Экспорт"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project.id, project.name);
                        }}
                        style={{
                          padding: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Удалить"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
