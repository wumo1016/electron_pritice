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

- 有主进程和渲染进程
  - 主进程: 用 node.js 调用 Electron 封装好的 API 来创建窗口, 管理应用的整个生命周期
  - 渲染进程: 加载传统的 web 界面
- 自定义协议
  - setAsDefaultProtocolClient: 设置协议
  - isDefaultProtocolClient: 查询状态
  - removeAsDefaultProtocolClient: 删除协议
- preload 脚本
  - preload 脚本可以访问 node 的全部 api 和 electron 提供的渲染进程 api

## 其他

- node 版本 16.15.1
- `-webkit-app-region: drag;`: 将整个文档都变成一个可拖拽的对象
