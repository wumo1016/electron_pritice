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
  mainWindow.loadURL(
    'https://www.w3schools.com/html/tryit.asp?filename=tryhtml_iframe_height_width'
  )
  // 大概一共有13个渲染进程，包括1个自身和12个iframe的
  mainWindow.webContents.openDevTools()
}
