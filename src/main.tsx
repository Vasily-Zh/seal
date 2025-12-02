import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// === ЭТО ГЛАВНОЕ: отправляем реальную высоту контента родителю ===
const sendHeight = () => {
  requestAnimationFrame(() => {
    const height = document.documentElement.scrollHeight
    window.parent.postMessage({ type: 'setHeight', height: height + 100 }, '*')
  })
}

// Первая отправка + при ресайзе + при изменении DOM
window.addEventListener('load', sendHeight)
window.addEventListener('resize', sendHeight)

const observer = new ResizeObserver(sendHeight)
observer.observe(document.body)
observer.observe(document.documentElement)

// На случай, если шрифты/изображения подгружаются позже
setTimeout(sendHeight, 100)
setTimeout(sendHeight, 500)
setTimeout(sendHeight, 1200)
setTimeout(sendHeight, 2500)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)