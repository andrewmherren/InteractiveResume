import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initConsoleSystem } from './utils/consoleSystem'

let consoleInitScheduled = false
let consoleFallbackTimerId

function scheduleConsoleInit() {
  if (consoleInitScheduled) {
    return
  }
  consoleInitScheduled = true

  if (consoleFallbackTimerId) {
    clearTimeout(consoleFallbackTimerId)
  }

  setTimeout(() => {
    initConsoleSystem()
  }, 500)
}

if (globalThis.__godotReady) {
  scheduleConsoleInit()
} else {
  window.addEventListener('godot-engine-ready', scheduleConsoleInit, { once: true })
  consoleFallbackTimerId = setTimeout(() => {
    scheduleConsoleInit()
  }, 8000)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
