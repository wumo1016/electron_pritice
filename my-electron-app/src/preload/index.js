const os = require('os')
const { contextBridge } = require('electron')

const platform = os.platform()
const release = os.release()

// 由于proload注入的脚本时机很早 所有需要在文档加载完毕后再操作dom
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('platform').append(platform)
  document.getElementById('release').append(release)
})

contextBridge.exposeInMainWorld('myAPI', {
  saveFile: () => {
    console.log('doSomething')
  }
})
