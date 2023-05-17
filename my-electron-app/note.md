## 项目搭建

- `yarn init`
  - 创建 package.json 文件应如下格式
  ```json
  {
    "name": "my-electron-app",
    "version": "1.0.0",
    "description": "Hello World!",
    "main": "main.js",
    "author": "wumo1016",
    "license": "MIT",
    "scripts": {
      "start": "electron ."
    }
  }
  ```
- `yarn add electron --dev`
- 根目录下创建 src 目录
  - main 目录: 存放跟主进程相关的代码
    - index.js
  - renderer 目录: 存放跟渲染进程相关的代码
    - index.html
- 启动
  - `npm start`
  - package.json 中的 main 对应入口文件

## Electron 介绍

- 进程
  - Electron(主进程): 必有。
    - 负责界面显示、用户交互、子进程管理，控制应用程序的地址栏、书签，前进/后退按钮等，同时提供存储等功能
    - 用 node.js 调用 Electron 封装好的 API 来创建窗口, 管理应用的整个生命周期
  - Electron Helper(网络服务): 必有。负责页面的网络资源加载
  - Electron Helper(GPU)(GPU 渲染): 必有。负责 GPU 渲染
  - Electron Helper(Renderer)(渲染进程): 负责网页排版和交互（排版引擎 Blink 和 JavaScript 引擎 V8 都是运行在该进程中）
    - 无法直接调用主进程
  - Electron Helper(Plugin)(插件进程): 负责插件的渲染
- 自定义协议
  - setAsDefaultProtocolClient: 设置协议
  - isDefaultProtocolClient: 查询状态
  - removeAsDefaultProtocolClient: 删除协议
- preload 脚本
  - preload 脚本可以访问 node 的全部 api 和 electron 提供的渲染进程 api

## API

- 主进程
  - BrowserWindow
    - options
      - width
      - height
      - titleBarStyle: 标题栏 - hiddenInset(隐藏)
    - 实例方法
      - loadURL: 加载指定网站
      - loadFile: 加载本地文件
      - setIgnoreMouseEvents: 设置忽略鼠标事件
- 渲染进程

## 三种进程通信方式

- sendSync & returnValue

```js
// 主进程
ipcMain.on('isDarkMode', (event, args) => {
  event.returnValue = nativeTheme.shouldUseDarkColors
})
// 渲染进程
const value = ipcRenderer.sendSync('isDarkMode')
console.log('sendSync reply', value)
```

- send & reply (推荐)

```js
// 主进程
ipcMain.on('isDarkMode', (event, args) => {
  event.reply('isDarkMode', nativeTheme.shouldUseDarkColors)
})
// 渲染进程
ipcRenderer.send('isDarkMode')
ipcRenderer.on('isDarkMode', (event, value) => {
  console.log('on reply', value)
})
```

- invoke & handle (推荐)

```js
// 主进程
ipcMain.handle('eventName', (_, arg1, arg2) => {
  console.log(arg1, arg2)
})
// 渲染进程 (可在 preload.js 中定义)
ipcRenderer.invoke('eventName', arg1, arg2)
```

## 四种原生菜单

- 窗口菜单
- 上下文菜单
- 托盘菜单
- Dock 菜单(mac os 专属)

## 三种对话框

- 选择对话框
  - 用于选择电脑上的文件或目录
- 保存对话框
- 消息对话框

## 其他

- node 版本 16.15.1
- `-webkit-app-region: drag;`: 将整个文档都变成一个可拖拽的对象
