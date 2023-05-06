const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('preloadApi', {
  setTheme: theme => {
    ipcRenderer.invoke('setTheme', theme)
  }
})
