const { app, BrowserWindow, ipcMain, protocol } = require('electron')
const path = require('path')
const fs = require('fs')
const https = require('https')

let mainWindow,
  width = 1200,
  height = 800

// protocol.registerSchemesAsPrivileged([
//   {
//     scheme: 'hello',
//     privileges: { standard: true }
//   }
// ])

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

  protocol.registerFileProtocol('cached', (request, callback) => {
    if (request.url.includes('img/')) {
      const filename = request.url.split('/').pop()
      const filePath = path.join(__dirname, '../img', filename)
      if (fs.existsSync(filePath)) return callback(filePath)
      console.log(filePath)
      const file = fs.createWriteStream(filePath)
      const fileURL = 'https://img.zlib.cn/' + filename
      https.get(fileURL, res => {
        res.pipe(file)
        file.on('finish', () => callback(filePath))
      })
    } else {
      const filePath = url.fileURLToPath(request.url)
      callback(filePath)
    }
  })

  protocol.registerFileProtocol('hello', (request, callback) => {
    const relativePath = request.url
      .replace(/^hello:\/\/host\//, '')
      .replace(/\/?\?.*/, '')
    const filePath = path.join(
      __dirname,
      request.url.includes('img') ? '../../src' : '../renderer',
      relativePath
    )
    callback(filePath)
  })
}
