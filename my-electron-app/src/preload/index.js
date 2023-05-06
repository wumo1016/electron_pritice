const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('preloadApi', {
  setTheme: theme => {
    ipcRenderer.send('setTheme', theme)
  }
})

ipcRenderer.on('setTheme', (_, msg) => {
  console.log(msg);
})
