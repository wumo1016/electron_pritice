const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

let mainWindow,
  width = 1200,
  height = 800

app.whenReady().then(() => {
  createWindow()
})
/**
 * @Author: wyb
 * @Descripttion: 创建 window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.webContents.openDevTools()
}

ipcMain.on('message', (e, msg) => {
  dialog.showMessageBox(mainWindow, {
    message: msg
  })
})
