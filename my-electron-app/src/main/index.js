const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow,
  width = 1000,
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
      webviewTag: true, // 需要添加此行
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })
  // mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.loadURL(' http://127.0.0.1:5173/')
  mainWindow.webContents.openDevTools()
}
