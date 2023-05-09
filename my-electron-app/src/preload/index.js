const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('preloadApi', {
  openMenu() {
    ipcRenderer.send('open-menu')
  }
})

ipcRenderer.on('set-menu', (event, value) => {
  if (value === 'bold') {
    const button = document.querySelector('#button')
    button.style.fontWeight = 'bold'
  } else if (value === 'color') {
    button.style.color = 'blue'
  }
})
