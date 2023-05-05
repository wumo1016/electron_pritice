const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow
app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hiddenInset'
  })
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  // 打开调试控制台
  mainWindow.webContents.openDevTools()
})
