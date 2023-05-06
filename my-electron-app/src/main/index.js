const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  createWindow()
})
/**
 * @Author: wyb
 * @Descripttion: 创建 window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
/**
 * @Author: wyb
 * @Descripttion: 订阅事件
 */
ipcMain.handle('setTheme', (_, theme) => {
  nativeTheme.themeSource = theme
})
