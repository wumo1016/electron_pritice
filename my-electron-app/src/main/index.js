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

  // 自定义UA
  const { session } = require('electron')

  const filters = {
    urls: ['https://*.github.com/*']
  }

  session.defaultSession.webRequest.onBeforeSendHeaders(
    filters,
    (details, callback) => {
      details.requestHeaders['User-Agent'] = 'MyAwesomeAgent'
      callback({ requestHeaders: details.requestHeaders })
    }
  )

  // 绕过跨域限制
  const filter = {
    urls: ['http://localhost:*/*']
  }
  win.webContents.session.webRequest.onHeadersReceived(
    filter,
    (details, callback) => {
      const { responseHeaders } = details
      responseHeaders['Access-Control-Allow-Origin'] = ['*']
      callback({ responseHeaders })
    }
  )

  // 请求转发
  mainWindow.webContents.session.webRequest.onBeforeRequest(
    {
      urls: [
        'https://dlweb.sogoucdn.com/pcsearch/web/index/images/logo_440x140_31de1d2.png?*'
      ]
    },
    (details, callback) => {
      callback({
        redirectURL:
          'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png'
      })
    }
  )

  mainWindow.loadURL('https://sogou.com')
  mainWindow.webContents.openDevTools()
}
