import { MainLayout } from './components/Layout/MainLayout';
import { useGoogleFonts } from './hooks/useGoogleFonts';
import './App.css';

function App() {
  // Загружаем все Google Fonts при старте приложения
  useGoogleFonts();

  return <MainLayout />;
}

export default App;
