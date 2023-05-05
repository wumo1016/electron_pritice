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
    mainWindow = new BrowserWindow({ width, height })
    mainWindow.loadFile(path.resolve(__dirname, '../renderer/index.html'))
  }
}
/**
 * @Author: wyb
 * @Descripttion:
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
 * @Descripttion: https://www.electronjs.org/zh/docs/latest/api/app#apprequestsingleinstancelockadditionaldata
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
