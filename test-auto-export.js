/**
 * Тестовый пример использования автоматического экспорта
 * Этот файл показывает, как программно использовать функцию autoExportProject
 */

// Импорт необходимых функций (в реальном проекте)
// import { autoExportProject, AutoExportOptions } from './src/utils/export';

/**
 * Пример 1: Базовое использование автоматического экспорта
 */
async function basicExportExample() {
  console.log('🧪 Тестирование базового автоматического экспорта...');
  
  // Получаем SVG элемент холста
  const svgElement = document.getElementById('stamp-canvas');
  if (!svgElement) {
    console.error('❌ SVG элемент с id="stamp-canvas" не найден');
    return;
  }

  try {
    // Получаем элементы проекта (в реальном проекте из store)
    const elements = []; // Здесь будут элементы проекта
    const projectName = 'Тестовая печать';
    
    // Базовые настройки
    const options = {
      vectorizeText: true,
      includePNG: true,
      includeTransparentPNG: true,
      includePDF: true,
      includeVectorizedSVG: true,
      includeOriginalSVG: false, // Не нужен оригинальный для теста
      filename: 'test_stamp',
      maxSize: 2000, // Меньший размер для быстрого теста
      quality: 'medium'
    };
    
    // Запускаем экспорт
    await autoExportProject(
      svgElement,
      elements,
      projectName,
      options,
      (progress, message) => {
        console.log(`📊 Прогресс: ${progress}% - ${message}`);
      }
    );
    
    console.log('✅ Базовый экспорт успешно завершен!');
  } catch (error) {
    console.error('❌ Ошибка при базовом экспорте:', error);
  }
}

/**
 * Пример 2: Экспорт только для веб-использования
 */
async function webExportExample() {
  console.log('🌐 Тестирование веб-экспорта...');
  
  const svgElement = document.getElementById('stamp-canvas');
  if (!svgElement) return;

  try {
    const elements = [];
    const projectName = 'Веб печать';
    
    // Настройки для веб-использования
    const options = {
      vectorizeText: false, // Не векторизуем для меньшего размера
      includePNG: true,     // Только PNG с фоном
      includeTransparentPNG: false,
      includePDF: false,    // PDF не нужен для веба
      includeVectorizedSVG: false,
      includeOriginalSVG: true, // Оригинальный SVG для веба
      filename: 'web_stamp',
      maxSize: 1000, // Маленький размер
      quality: 'low'
    };
    
    await autoExportProject(svgElement, elements, projectName, options);
    console.log('✅ Веб-экспорт завершен!');
  } catch (error) {
    console.error('❌ Ошибка веб-экспорта:', error);
  }
}

/**
 * Пример 3: Экспорт высокого качества для печати
 */
async function printExportExample() {
  console.log('🖨️ Тестирование экспорта для печати...');
  
  const svgElement = document.getElementById('stamp-canvas');
  if (!svgElement) return;

  try {
    const elements = [];
    const projectName = 'Печатная печать';
    
    // Настройки для профессиональной печати
    const options = {
      vectorizeText: true,     // Векторизуем для качества
      includePNG: true,        // Высокое разрешение PNG
      includeTransparentPNG: true, // Для наложений
      includePDF: true,        // PDF для векторной печати
      includeVectorizedSVG: true,  // Для редактирования в CorelDRAW
      includeOriginalSVG: true,    // Для веб-использования
      filename: 'print_stamp',
      maxSize: 4000,           // Максимальное разрешение
      quality: 'high'          // Лучшее качество
    };
    
    await autoExportProject(svgElement, elements, projectName, options);
    console.log('✅ Экспорт для печати завершен!');
  } catch (error) {
    console.error('❌ Ошибка экспорта для печати:', error);
  }
}

/**
 * Пример 4: Пользовательские настройки с callback'ами
 */
async function customExportExample() {
  console.log('⚙️ Тестирование кастомного экспорта...');
  
  const svgElement = document.getElementById('stamp-canvas');
  if (!svgElement) return;

  try {
    const elements = [];
    const projectName = 'Кастомная печать';
    
    // Получаем настройки от пользователя (пример)
    const userSettings = {
      vectorizeText: confirm('Векторизовать текст?'),
      includePNG: confirm('Включить PNG с фоном?'),
      includeTransparentPNG: confirm('Включить прозрачный PNG?'),
      includePDF: confirm('Включить PDF?'),
      includeVectorizedSVG: confirm('Включить векторизованный SVG?'),
      includeOriginalSVG: confirm('Включить оригинальный SVG?'),
    };
    
    const options = {
      ...userSettings,
      filename: prompt('Введите имя файла:', 'custom_stamp') || 'custom_stamp',
      maxSize: parseInt(prompt('Максимальный размер PNG:', '2000') || '2000'),
      quality: prompt('Качество (high/medium/low):', 'medium') || 'medium'
    };
    
    // Кастомный callback для отслеживания прогресса
    await autoExportProject(
      svgElement,
      elements,
      projectName,
      options,
      (progress, message) => {
        // Кастомная обработка прогресса
        const progressBar = document.getElementById('custom-progress');
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
          progressBar.textContent = message;
        }
        console.log(`🔄 [${progress}%] ${message}`);
      }
    );
    
    console.log('✅ Кастомный экспорт завершен!');
  } catch (error) {
    console.error('❌ Ошибка кастомного экспорта:', error);
  }
}

/**
 * Функция для создания демонстрационного проекта
 */
function createDemoProject() {
  console.log('🎨 Создание демонстрационного проекта...');
  
  // Создаем простой SVG для тестирования
  const demoSVG = `
    <svg id="stamp-canvas" width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="white"/>
      <circle cx="150" cy="150" r="120" fill="none" stroke="blue" stroke-width="3"/>
      <text x="150" y="150" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="red">
        ДЕМО
      </text>
      <text x="150" y="200" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="black">
        ТЕКСТ
      </text>
    </svg>
  `;
  
  // Добавляем на страницу если его нет
  if (!document.getElementById('stamp-canvas')) {
    document.body.innerHTML = demoSVG + document.body.innerHTML;
  }
  
  console.log('✅ Демонстрационный SVG создан');
}

/**
 * Функция для запуска всех тестов
 */
function runAllTests() {
  console.log('🚀 Запуск всех тестов автоматического экспорта...\n');
  
  // Создаем демо проект
  createDemoProject();
  
  // Запускаем тесты последовательно
  (async () => {
    try {
      await basicExportExample();
      console.log('⏳ Пауза 2 секунды...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await webExportExample();
      console.log('⏳ Пауза 2 секунды...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await printExportExample();
      console.log('⏳ Пауза 2 секунды...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('🎉 Все тесты завершены успешно!');
    } catch (error) {
      console.error('💥 Критическая ошибка в тестах:', error);
    }
  })();
}

/**
 * Биндинг для использования в браузере
 */
if (typeof window !== 'undefined') {
  // Добавляем функции в глобальную область видимости для тестирования
  window.testAutoExport = {
    basic: basicExportExample,
    web: webExportExample,
    print: printExportExample,
    custom: customExportExample,
    all: runAllTests,
    createDemo: createDemoProject
  };
  
  console.log('🧪 Тестовые функции загружены. Используйте:');
  console.log('- window.testAutoExport.all() - все тесты');
  console.log('- window.testAutoExport.basic() - базовый тест');
  console.log('- window.testAutoExport.web() - веб-экспорт');
  console.log('- window.testAutoExport.print() - экспорт для печати');
  console.log('- window.testAutoExport.custom() - кастомные настройки');
}

// Экспорт для Node.js (если нужно)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    basicExportExample,
    webExportExample,
    printExportExample,
    customExportExample,
    runAllTests,
    createDemoProject
  };
}

/*
 * ИСПОЛЬЗОВАНИЕ В БРАУЗЕРЕ:
 * 
 * 1. Откройте консоль разработчика (F12)
 * 2. Загрузите этот файл: <script src="test-auto-export.js"></script>
 * 3. Запустите тест: window.testAutoExport.all()
 * 
 * ИЛИ интерактивно:
 * 
 * > window.testAutoExport.createDemo() // Создать демо SVG
 * > window.testAutoExport.basic()      // Базовый тест
 * > window.testAutoExport.web()        // Веб-экспорт
 * > window.testAutoExport.print()      // Экспорт для печати
 * 
 * ТРЕБОВАНИЯ:
 * - Функция autoExportProject должна быть доступна глобально
 * - SVG элемент с id="stamp-canvas" должен существовать
 * - Элементы проекта должны быть доступны
 */