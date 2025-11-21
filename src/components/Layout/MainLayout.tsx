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
        {/* Левая панель инструментов */}
        <Toolbar />

        {/* Панель управления (60%) */}
        <div
          style={{
            width: '60%',
            borderRight: '1px solid #e5e7eb',
            overflow: 'auto',
          }}
        >
          <Controls />
        </div>

        {/* Превью (40%) */}
        <div
          style={{
            width: '40%',
            overflow: 'hidden',
          }}
        >
          <Canvas />
        </div>
      </div>
    </div>
  );
};
