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

## 快捷键

- 全局快捷键 globalShortcut
  - 注册和取消注册
    - 注册: register、registerAll
    - 取消注册: unregister、unregisterAll
- 局部快捷键 localShortcut
  - 应用启动才生效
  - 注册
    - 使用自定义菜单
    - 使用库 `electron-localshortcut`
- 格式
  - 有效的快捷键由多个功能键和一个键码中间用加号（+）组合而成
  - 常见功能键
    - `Cmd、Ctrl、CmdOrCtrl、Alt、Shift、Meta`
  - 常见键码
    - `0~9、A~Z、F1~F24、Space、Tab、Backspace、Delete、Enter、Esc 等`
- 注意事项
  - 如果快捷键字符串无效会直接报错，因此建议在使用此方法的时候加 try catch 语句，防止程序崩溃
  - 该方法并不确保一定可以成功注册全局快捷键，因为有可能被电脑上的其他应用提前占用了，此时并不会报错，而是返回 false，因此我们可以通过返回值来判断快捷键是否注册成功

## 剪切板 clipboard

- 可以在主进程和渲染进程中调用(在渲染进程中 即 proload.js 脚本中, 必须是非沙箱环境下才能使用 clipboard 模块)
- 常用方法
  - availableFormats: 查看剪切板支持的数据格式
  - readText 和 writeText: 从剪切板读取或写入纯文本数据
  - readHTML 和 writeHTML: 从剪切板读取或写入 html 格式数据
  - readImage 和 writeImage: 从剪切板读取或写入 html 格式数据
  - readRTF 和 writeRTF: 从剪切板读取或写入 RTF 格式数据
  - clear: 清空剪切板内容

## 网络拦截

- 只能在主进程中使用

## 会话管理(session)

- 获取
  - session.defaultSession: 应用中的默认 session
  - win.webContents.session: 某个 webContents 使用的 session, 如果在创建窗口的时候未指定, 就是默认 session
- 创建(两种方式)

```js
// 指定一个 session 对象
// cache默认是true 只是控制disk cache的(是否缓存到硬盘, 并非控制所有缓存-内存缓存、代码缓存等)
// 如果 key 以 persist: 开头 那么整个应用都会使用这个持久化的session, 否则会使用内存中的 session
const newSession = session.fromPartition('new', { cache: false })
const win = new BrowserWindow({
  width: 400,
  height: 300,
  webPreferences: { session: newSession }
})
win.loadURL('https://www.baidu.com')
console.log(session.defaultSession === win.webContents.session) // false
console.log(win.webContents.session === newSession) // true

// 指定 partition 字符串
win = new BrowserWindow({
  width: 400,
  height: 300,
  webPreferences: { partition: 'new' }
})
win.loadURL('https://www.baidu.com')
console.log(session.defaultSession === win.webContents.session) // false
```

- 设置代理
- 资源加载(设置和获取预加载脚本)
  - setPreloads: 设置 preload 脚本
    - webPreferences 中的 preload 脚本只能设置一个
    - setPreloads 不仅可以设置多个, 执行时机比 webPreferences 中的早
    ```js
    const newSession = session.fromPartition('new', { cache: false })
    newSession.setPreloads([
      path.join(__dirname, '../preload/p1.js'),
      path.join(__dirname, '../preload/p2.js')
    ])
    ```
  - getPreloads: 获取 preload 脚本
- 本地存储

  - getStoragePath: 获取存储陆军(内存会话返回 null)
  - clearStorageData: 清空本地数据
  - flushStorageData: 将所有数据持久化到磁盘

  ```js
  const newSession = session.fromPartition('new', { cache: false })
  console.log(newSession.getStoragePath()) // null

  const newSession = session.fromPartition('new', { cache: true })
  console.log(newSession.getStoragePath()) // null

  const newSession = session.fromPartition('persist:new', { cache: false })
  console.log(newSession.getStoragePath()) // ~/Library/Application Support/electron-desktop/Partitions/new

  const newSession = session.fromPartition('persist:new', { cache: true })
  console.log(newSession.getStoragePath()) // ~/Library/Application Support/electron-desktop/Partitions/new
  ```

- 权限控制
- 插件管理(可以加载 Chrome 插件)
  - 方法
    - loadExtension
    - removeExtension
    - getExtension
    - getAllExtensions
  - 事件
    - extension-loaded
    - extension-unloaded
    - extension-ready
- 文件下载
- 操作 cookie

  - get(包括 http-only 的也能拿到)
  - set
  - remove
  - flushStore

  ```js
  const defaultSession = mainWindow.webContents.session
  // 写
  defaultSession.cookies.set({
    url: 'http://www.baidu.com',
    name: 'username',
    value: '小明'
  })
  // 获取
  session.defaultSession.cookies.get({
    url: 'http://www.baidu.com',
    name: 'username'
  })
  ```

## 电源管理

- powerMonitor
  - 属性
    - onBatteryPower: 效果同方法 isOnBatteryPower
  - 方法
    - getSystemIdleTime: 获取空闲时间
    - isOnBatteryPower: 是否使用电池供电
  - 事件
    - lock-screen: 锁屏
    - unlock-screen: 解锁
    - suspend: 休眠
    - resume: 唤醒
- powerSaveBlocker
  - 方法
    - start: 阻止休眠
      - 参数有以下可选值
        - prevent-app-suspension: 保持系统活跃，但屏幕可以不亮
        - prevent-display-sleep: 保持系统和屏幕活跃，屏幕要一直亮
    - stop: 停止阻止行为
      - 一个参数为 start 方法的返回值
    - isStart: 查询阻止行为是否处于启用状态
      - 一个参数为 start 方法的返回值

## 其他

- node 版本 16.15.1
- `-webkit-app-region: drag;`: 将整个文档都变成一个可拖拽的对象
