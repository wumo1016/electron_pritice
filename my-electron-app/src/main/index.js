const { app, BrowserWindow, Tray, screen } = require('electron')
const path = require('path')

let tray,
  mainWindow,
  width = 300,
  height = 420

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { height: screenHeight } = primaryDisplay.workAreaSize
  createWindow()
  // 可创建多个系统托盘
  tray = new Tray(path.join(__dirname, '../images/phoneTemplate.png'))
  const trayBounds = tray.getBounds()
  tray.on('right-click', () => {
    console.log(mainWindow.isVisible())
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.setPosition(
        trayBounds.x + trayBounds.width / 2 - width / 2,
        screenHeight - height
      )
      mainWindow.show()
    }
  })
})
/**
 * @Author: wyb
 * @Descripttion: 创建 window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width,
    height,
    frame: false,
    resizable: false,
    show: false,
    movable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })
  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  // mainWindow.webContents.openDevTools()

  mainWindow.on('blur', () => {
    mainWindow.hide()
  })
}
