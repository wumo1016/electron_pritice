const { app, BrowserWindow, ipcMain, session } = require('electron')
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
  const newSession = session.fromPartition('test')
  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, '../preload/index.js'),
      session: newSession
    }
  })

  console.log(session.defaultSession === mainWindow.webContents.session)
  console.log(newSession === mainWindow.webContents.session)

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.webContents.openDevTools()
}
