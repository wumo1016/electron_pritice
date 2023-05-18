const { app, BrowserWindow, Menu, globalShortcut } = require('electron')
const path = require('path')
const localShortcut = require('electron-localshortcut')

let mainWindow,
  width = 1000,
  height = 800

const tpl = [
  {
    label: '自定义菜单',
    submenu: [
      {
        label: '绑定快捷键',
        accelerator: 'Ctrl+Shift+K',
        visible: false, // 设置菜单项为隐藏菜单
        click: () => {
          console.log('menu shortcut pressed')
        }
      }
    ]
  }
]

app.whenReady().then(() => {
  createWindow()
  registerGlobalShortcut('Alt + Q', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  localShortcut.register(mainWindow, 'Ctrl+Shift+H', () => {
    console.log('register local shortcut for mainWindow')
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
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })
  if (process.platform === 'darwin') {
    tpl.unshift({ label: '' })
  }
  const menu = Menu.buildFromTemplate(tpl)
  Menu.setApplicationMenu(menu)

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  mainWindow.webContents.openDevTools()
}

function registerGlobalShortcut(shortcut, cb) {
  if (!shortcut) return false
  let flag = false
  try {
    // 该方法只能检测当前应用是否注册过这个快捷键，并不能检测到快键键是否被其他应用占用
    flag = globalShortcut.isRegistered(shortcut)
    if (flag) return true
    flag = globalShortcut.register(shortcut, cb)
  } catch (e) {
    console.error(e)
  }
  return flag
}
