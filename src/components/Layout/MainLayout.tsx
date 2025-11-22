import { Header } from '../Header/Header';
import { Toolbar } from '../Toolbar/Toolbar';
import { Controls } from '../Controls/Controls';
import { Canvas } from '../Canvas/Canvas';

export const MainLayout = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Шапка */}
      <Header />

      {/* Основной контент */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Левая колонка - Превью (40%) */}
        <div
          style={{
            width: '40%',
            borderRight: '1px solid #e5e7eb',
            overflow: 'hidden',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Превью
            </h3>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Canvas />
          </div>
        </div>

        {/* Правая колонка - Управление (60%) */}
        <div
          style={{
            width: '60%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Блок 1: Кнопки (Toolbar) */}
          <div
            style={{
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#fff',
              padding: '12px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
              Инструменты
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Toolbar />
            </div>
          </div>

          {/* Блоки 2 и 3: Список элементов и Настройки */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              overflow: 'hidden',
              backgroundColor: '#fff',
            }}
          >
            {/* Блок 2: Список элементов */}
            <div
              style={{
                width: '50%',
                borderRight: '1px solid #e5e7eb',
                overflow: 'auto',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                Список элементов
              </h4>
              <Controls showOnlyElements={true} />
            </div>

            {/* Блок 3: Настройки элемента */}
            <div
              style={{
                width: '50%',
                overflow: 'auto',
                padding: '16px',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                Настройки элемента
              </h4>
              <Controls showOnlySettings={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
