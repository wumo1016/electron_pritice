const { app, BrowserWindow, ipcMain, Menu } = require('electron')
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

ipcMain.on('open-menu', (event, ...args) => {
  const menu = Menu.buildFromTemplate([
    {
      label: '文字加粗',
      click: () => {
        event.reply('set-menu', 'bold')
      }
    },
    {
      label: '改变颜色',
      click: () => {
        event.reply('set-menu', 'color')
      }
    }
  ])
  menu.popup({
    // window: BrowserWindow.getFocusedWindow(),
    // x: 10, // 相对于窗口的x轴偏移，默认是鼠标位置的横坐标
    // y: 20, // 相对于窗口的y轴偏移，默认是鼠标位置的纵坐标
    callback: () => {
      console.log('menu closed')
    }
  })
})
