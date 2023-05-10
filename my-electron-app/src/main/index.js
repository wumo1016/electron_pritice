const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')

let tray

const menus = [
  {
    label: '关于',
    role: 'about'
  },
  { type: 'separator' },
  {
    label: '菜单2',
    click: () => {
      console.log('点击了菜单2')
    }
  },
  {
    label: '子菜单',
    submenu: [
      {
        label: '显示窗口',
        click: () => {
          console.log('点击了二级菜单')
        }
      },
      {
        label: '打开控制台',
        role: 'toggleDevTools'
      }
    ]
  },
  { type: 'separator' },
  {
    label: '退出',
    role: 'quit'
  }
]
const contextMenu = Menu.buildFromTemplate(menus)

app.whenReady().then(() => {
  createWindow()
  // 可创建多个系统托盘
  tray = new Tray(path.join(__dirname, '../images/phoneTemplate.png'))
  tray.setContextMenu(contextMenu) // 设置托盘菜单
  tray.setToolTip('我是一个小提示呀') // 设置托盘图标提示
  //  可以设置 2秒之后，自动弹出托盘菜单 但是会显示在鼠标位置
  setTimeout(() => {
    const popUpMenu = Menu.buildFromTemplate(menus.slice(1))
    tray.popUpContextMenu(popUpMenu)
  }, 2000)
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
