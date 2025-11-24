import { Undo2, Redo2, Download, Settings, Save, FolderOpen } from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import { exportToPNG, exportToSVG, exportToPNGTransparent, exportToPDF } from '../../utils/export';
import { useState } from 'react';
import { AdminLoginModal } from '../Admin/AdminLoginModal';
import { AdminPanel } from '../Admin/AdminPanel';
import { isAdminLoggedIn } from '../../utils/auth';
import { ProjectManager } from '../ProjectManager/ProjectManager';
import { saveProject, generateThumbnail } from '../../utils/projectStorage';

export const Header = () => {
  const undo = useStampStore((state) => state.undo);
  const redo = useStampStore((state) => state.redo);
  const canUndo = useStampStore((state) => state.canUndo());
  const canRedo = useStampStore((state) => state.canRedo());
  const elements = useStampStore((state) => state.elements);
  const canvasSize = useStampStore((state) => state.canvasSize);
  const currentProjectId = useStampStore((state) => state.currentProjectId);
  const currentProjectName = useStampStore((state) => state.currentProjectName);
  const setCurrentProject = useStampStore((state) => state.setCurrentProject);
  const loadProjectData = useStampStore((state) => state.loadProjectData);

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);

  const handleExportPNG = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    exportToPNG(svgElement);
    setShowExportMenu(false);
  };

  const handleExportPNGTransparent = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    exportToPNGTransparent(svgElement);
    setShowExportMenu(false);
  };

  const handleExportSVG = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    exportToSVG(svgElement);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    exportToPDF(svgElement);
    setShowExportMenu(false);
  };

  const handleSaveProject = async () => {
    const projectName = currentProjectName || prompt('Введите название проекта:', 'Новый проект');
    if (!projectName) return;

    setIsSaving(true);
    try {
      const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
      const thumbnail = await generateThumbnail(svgElement);

      const projectId = saveProject(
        projectName,
        elements,
        canvasSize,
        currentProjectId || undefined,
        thumbnail
      );

      setCurrentProject(projectId, projectName);
      alert('Проект успешно сохранён!');
    } catch (error) {
      alert((error as Error).message || 'Ошибка при сохранении проекта');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingsClick = () => {
    if (isAdminLoggedIn()) {
      setShowAdminPanel(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (needsChange: boolean) => {
    setNeedsPasswordChange(needsChange);
    setShowLoginModal(false);
    setShowAdminPanel(true);
  };

  return (
    <header
      style={{
        padding: '12px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
          Конструктор печатей и штампов
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {/* Кнопка Сохранить проект */}
        <button
          onClick={handleSaveProject}
          disabled={isSaving}
          style={{
            padding: '8px 16px',
            border: '1px solid #10b981',
            borderRadius: '6px',
            backgroundColor: '#10b981',
            color: 'white',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <Save size={16} />
          {isSaving ? 'Сохранение...' : currentProjectName ? 'Сохранить' : 'Сохранить проект'}
        </button>

        {/* Кнопка Загрузить проект */}
        <button
          onClick={() => setShowProjectManager(true)}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          <FolderOpen size={16} />
          Проекты
        </button>

        {/* Разделитель */}
        <div style={{ width: '1px', height: '32px', backgroundColor: '#e5e7eb' }} />

        {/* Кнопка Отмена */}
        <button
          onClick={undo}
          disabled={!canUndo}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: canUndo ? '#fff' : '#f3f4f6',
            cursor: canUndo ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: canUndo ? '#374151' : '#9ca3af',
          }}
        >
          <Undo2 size={16} />
          Отменить
        </button>

        {/* Кнопка Вернуть */}
        <button
          onClick={redo}
          disabled={!canRedo}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: canRedo ? '#fff' : '#f3f4f6',
            cursor: canRedo ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: canRedo ? '#374151' : '#9ca3af',
          }}
        >
          <Redo2 size={16} />
          Вернуть
        </button>

        {/* Кнопка Экспорт */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#3b82f6',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <Download size={16} />
            Сохранить
          </button>

          {showExportMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                minWidth: '150px',
              }}
            >
              <button
                onClick={handleExportPNG}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Сохранить как PNG
              </button>
              <button
                onClick={handleExportPNGTransparent}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Сохранить как PNG (без фона)
              </button>
              <button
                onClick={handleExportSVG}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Сохранить как SVG
              </button>
              <button
                onClick={handleExportPDF}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Сохранить как PDF
              </button>
            </div>
          )}
        </div>

        {/* Кнопка Настройки */}
        <button
          onClick={handleSettingsClick}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          <Settings size={16} />
          Настройки
        </button>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        needsPasswordChange={needsPasswordChange}
      />

      {/* Project Manager */}
      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
        onLoadProject={(project) => {
          loadProjectData(project);
        }}
      />
    </header>
  );
};
