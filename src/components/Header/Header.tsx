import { Undo2, Redo2, Download, Settings, Save, FolderOpen, Package } from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import { exportToZIP } from '../../utils/export';
import { useState } from 'react';
import { AdminLoginModal } from '../Admin/AdminLoginModal';
import { AdminPanel } from '../Admin/AdminPanel';
import { isAdminLoggedIn } from '../../utils/auth';
import { ProjectManager } from '../ProjectManager/ProjectManager';
import { saveProject, generateThumbnail } from '../../utils/projectStorage';
import { AutoExportDialog } from './AutoExportDialog';

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

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showAutoExportDialog, setShowAutoExportDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);

  const handleExportZIP = async () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    setIsExporting(true);
    try {
      await exportToZIP(svgElement);
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте файлов');
    } finally {
      setIsExporting(false);
    }
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

        {/* Кнопка Скачать */}
        <button
          onClick={handleExportZIP}
          disabled={isExporting}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            color: 'white',
            cursor: isExporting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
            opacity: isExporting ? 0.6 : 1,
          }}
        >
          <Download size={16} />
          {isExporting ? 'Скачивание...' : 'Скачать'}
        </button>

        {/* Кнопка Автоэкспорт */}
        <button
          onClick={() => setShowAutoExportDialog(true)}
          style={{
            padding: '8px 16px',
            border: '1px solid #8b5cf6',
            borderRadius: '6px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          <Package size={16} />
          Автоэкспорт
        </button>

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

      {/* Auto Export Dialog */}
      <AutoExportDialog
        isOpen={showAutoExportDialog}
        onClose={() => setShowAutoExportDialog(false)}
      />
    </header>
  );
};
