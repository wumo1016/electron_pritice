const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('preloadApi', {
  save() {
    const content = document.querySelector('#content').value
    ipcRenderer.send('save', content)
  }
})
