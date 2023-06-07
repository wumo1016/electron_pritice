const { contextBridge, ipcRenderer, powerMonitor } = require('electron')

contextBridge.exposeInMainWorld('preloadApi', {})

document.addEventListener('DOMContentLoaded', () => {
  const boxDom = document.querySelector('ul')
  ipcRenderer.on('log-time', (e, value) => {
    const li = document.createElement('li')
    li.textContent = `空闲了${value}s`
    boxDom.appendChild(li)
  })
})
