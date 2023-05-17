const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

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
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.webContents.openDevTools()
}

ipcMain.on('save', (e, value) => {
  dialog
    .showSaveDialog({
      title: '请选择保存位置',
      properties: ['openFile']
    })
    .then(async it => {
      fs.writeFileSync(it.filePath, value)
    })
})
