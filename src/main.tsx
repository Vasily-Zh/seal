import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Отправляем фиксированную высоту родителю
const FIXED_HEIGHT = 800

const sendHeight = () => {
  window.parent.postMessage({ type: 'setHeight', height: FIXED_HEIGHT }, '*')
}

// Отправляем при загрузке
window.addEventListener('load', sendHeight)

// При ресайзе на мобильных
window.addEventListener('resize', () => {
  const isMobile = window.innerWidth < 768
  const height = isMobile ? Math.max(window.innerHeight, 900) : FIXED_HEIGHT
  window.parent.postMessage({ type: 'setHeight', height }, '*')
})

// Первоначальная отправка
setTimeout(sendHeight, 100)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)