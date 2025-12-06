import { Undo2, Redo2, Download, Settings, Save, FolderOpen } from 'lucide-react';
import { useStampStore } from '../../store/useStampStore';
import { exportToZIP, exportToPNGTransparent, exportToSVG, exportToPDF } from '../../utils/export';
import { useState, useEffect, useRef } from 'react';
import { AdminLoginModal } from '../Admin/AdminLoginModal';
import { AdminPanel } from '../Admin/AdminPanel';
import { isAdminLoggedIn } from '../../utils/auth';
import { ProjectManager } from '../ProjectManager/ProjectManager';
import { saveProject, generateThumbnail } from '../../utils/projectStorage';

// Определение iOS
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

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
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Закрытие меню экспорта при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        exportMenuRef.current && 
        !exportMenuRef.current.contains(target) &&
        exportButtonRef.current &&
        !exportButtonRef.current.contains(target)
      ) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showExportMenu]);

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

  // Обработчик кнопки скачивания - на iOS показываем меню, на других скачиваем ZIP
  const handleDownloadClick = () => {
    if (isIOS()) {
      setShowExportMenu(!showExportMenu);
    } else {
      handleExportZIP();
    }
  };

  // Экспорт в PNG (прозрачный фон)
  const handleExportPNG = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      exportToPNGTransparent(svgElement, 'stamp.png');
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте PNG');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  // Экспорт в SVG
  const handleExportSVG = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      exportToSVG(svgElement);
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте SVG');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  // Экспорт в PDF
  const handleExportPDF = () => {
    const svgElement = document.getElementById('stamp-canvas') as unknown as SVGSVGElement;
    setIsExporting(true);
    setShowExportMenu(false);
    try {
      exportToPDF(svgElement);
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте PDF');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
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
        padding: isMobile ? '12px 16px' : '12px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '0',
      }}
    >
      <div style={{ textAlign: 'center', width: '100%' }}>
        <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '700', color: '#111827' }}>
          Конструктор печатей и штампов
        </h1>
      </div>

      {isMobile ? (
        // Mobile layout with compact icon-only buttons in two rows if needed
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Row 1: Save and Load */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
            <button
              onClick={handleSaveProject}
              disabled={isSaving}
              style={{
                padding: '8px',
                border: '1px solid #10b981',
                borderRadius: '6px',
                backgroundColor: '#10b981',
                color: 'white',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isSaving ? 0.6 : 1,
              }}
              title={isSaving ? 'Сохранение...' : currentProjectName ? 'Сохранить' : 'Сохранить проект'}
            >
              <Save size={16} />
            </button>

            <button
              onClick={() => setShowProjectManager(true)}
              style={{
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
              }}
              title="Проекты"
            >
              <FolderOpen size={16} />
            </button>

            <button
              onClick={handleSettingsClick}
              style={{
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#374151',
              }}
              title="Настройки"
            >
              <Settings size={16} />
            </button>
          </div>

          {/* Row 2: Undo, Redo, Download */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={undo}
              disabled={!canUndo}
              style={{
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: canUndo ? '#fff' : '#f3f4f6',
                cursor: canUndo ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: canUndo ? '#374151' : '#9ca3af',
              }}
              title="Отменить"
            >
              <Undo2 size={16} />
            </button>

            <button
              onClick={redo}
              disabled={!canRedo}
              style={{
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: canRedo ? '#fff' : '#f3f4f6',
                cursor: canRedo ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: canRedo ? '#374151' : '#9ca3af',
              }}
              title="Вернуть"
            >
              <Redo2 size={16} />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                ref={exportButtonRef}
                onClick={handleDownloadClick}
                disabled={isExporting}
                style={{
                  padding: '8px',
                  border: 'none',
                  borderRadius: '6px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isExporting ? 0.6 : 1,
                }}
                title={isExporting ? 'Скачивание...' : 'Скачать'}
              >
                <Download size={16} />
              </button>

              {/* Выпадающее меню для iOS (мобильная версия) */}
              {showExportMenu && (
                <div
                  ref={exportMenuRef}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    zIndex: 1000,
                    minWidth: '120px',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={handleExportPNG}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    PNG
                  </button>
                  <button
                    onClick={handleExportSVG}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    SVG
                  </button>
                  <button
                    onClick={handleExportPDF}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '14px',
                    }}
                  >
                    PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Desktop layout
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

          {/* Кнопка Скачать с меню для iOS */}
          <div style={{ position: 'relative' }}>
            <button
              ref={exportButtonRef}
              onClick={handleDownloadClick}
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

            {/* Выпадающее меню для iOS */}
            {showExportMenu && (
              <div
                ref={exportMenuRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 1000,
                  minWidth: '150px',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={handleExportPNG}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  PNG
                </button>
                <button
                  onClick={handleExportSVG}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  SVG
                </button>
                <button
                  onClick={handleExportPDF}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  PDF
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
      )}

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
