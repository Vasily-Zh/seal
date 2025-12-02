import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// === ОТЛАДКА: логируем всё что связано с высотой ===
let messageCount = 0

const logHeight = (source: string) => {
  messageCount++
  const data = {
    source,
    messageCount,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    bodyScrollHeight: document.body.scrollHeight,
    bodyClientHeight: document.body.clientHeight,
    innerHeight: window.innerHeight,
    outerHeight: window.outerHeight,
  }
  console.log('[STAMP HEIGHT DEBUG]', data)
  return data
}

// Отправляем фиксированную высоту
const FIXED_HEIGHT = 800

const sendHeight = (source: string) => {
  logHeight(source)
  console.log('[STAMP] Sending height to parent:', FIXED_HEIGHT, 'from:', source)
  window.parent.postMessage({ type: 'setHeight', height: FIXED_HEIGHT }, '*')
}

// Слушаем сообщения от родителя (на случай если он что-то шлёт)
window.addEventListener('message', (e) => {
  console.log('[STAMP] Received message from parent:', e.data)
})

// Отправляем только один раз при загрузке
window.addEventListener('load', () => sendHeight('load'))

// Логируем resize но НЕ отправляем (для отладки)
window.addEventListener('resize', () => {
  logHeight('resize (no send)')
})

// Первоначальная отправка
setTimeout(() => sendHeight('timeout-100'), 100)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)