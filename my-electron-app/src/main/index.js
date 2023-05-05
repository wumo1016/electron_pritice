const { app, BrowserWindow } = require('electron')
const path = require('path')

let mainWindow,
  urlParams = {}

const protocol = 'zhufeng'
const scheme = `${protocol}://`
app.setAsDefaultProtocolClient(protocol)

app.whenReady().then(() => {
  createWindow()
})
/**
 * @Author: wyb
 * @Descripttion: 创建 window
 */
function createWindow() {
  const width = parseInt(urlParams.width) || 800
  const height = parseInt(urlParams.height) || 600
  if (mainWindow) {
    mainWindow.setSize(width, height)
  } else {
    mainWindow = new BrowserWindow({
      width,
      height,
      webPreferences: {
        nodeIntegration: false, // 是否开启node.js 环境集成(不建议开启)
        contextIsolation: true, // 是否启用上下文隔离(默认启用 mpreload.js 脚本和 index.html 是否共享相同的 document 和 window 对象)(如果开启了就可以在浏览器的控制台的top下拉中看到)
        sandbox: false,
        preload: path.join(__dirname, '../preload/index.js') // 预加载脚本
      }
    })
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    // mainWindow.loadURL('https://www.juejin.cn')
    // 打开调试控制台
    mainWindow.webContents.openDevTools()
  }
}

/**
 * @Author: wyb
 * @Descripttion: 处理 Scheme 唤醒
 * @param {*} argv
 */
function handleSchemeWakeup(argv) {
  const url = [].concat(argv).find(v => v.startsWith(scheme))
  if (!url) return
  const searchParams = new URLSearchParams(url.slice(scheme.length))
  urlParams = Object.fromEntries(searchParams.entries())
  if (app.isReady()) createWindow()
}

/**
 * @Author: wyb
 * @Descripttion: 保持单例
 */
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, argv) => {
    mainWindow.restore()
    mainWindow.show()
    handleSchemeWakeup(argv)
  })
}
