import { Header } from '../Header/Header';
import { Toolbar } from '../Toolbar/Toolbar';
import { Controls } from '../Controls/Controls';
import { Canvas } from '../Canvas/Canvas';

export const MainLayout = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Шапка */}
      <Header />

      {/* Основной контент - горизонтальный layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Блок 1: Добавить (Toolbar) - 140px */}
        <div
          style={{
            width: '140px',
            borderRight: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            padding: '16px 12px',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151', textAlign: 'center', marginBottom: '8px' }}>
            Добавить
          </div>
          <Toolbar />
        </div>

        {/* Блок 2: Список элементов - 25% */}
        <div
          style={{
            width: '25%',
            borderRight: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            overflow: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', marginTop: 0, color: '#111827' }}>
            Список элементов
          </h4>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Controls showOnlyElements={true} />
          </div>
        </div>

        {/* Блок 3: Настройки элемента - 25% */}
        <div
          style={{
            width: '25%',
            borderRight: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            overflow: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h4 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', marginTop: 0, color: '#111827' }}>
            Настройки элемента
          </h4>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Controls showOnlySettings={true} />
          </div>
        </div>

        {/* Блок 4: Превью - треть экрана */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0 }}>
              Превью
            </h3>
          </div>
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Canvas />
          </div>
        </div>
      </div>
    </div>
  );
};
