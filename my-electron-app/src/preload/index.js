const { contextBridge, ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', () => {
  const clock = document.getElementById('clock')
  clock.addEventListener('mouseenter', () => {
    ipcRenderer.send('set-ignore-mouse-events', false)
  })
  clock.addEventListener('mouseleave', () => {
    ipcRenderer.send('set-ignore-mouse-events', true, { forward: true })
  })
})

contextBridge.exposeInMainWorld('preloadApi', {
  setWindow(...args) {
    ipcRenderer.send('set-window-events', ...args)
  }
})
