const { contextBridge, clipboard, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('preloadApi', {
  read() {
    const formats = clipboard.availableFormats() //  ['text/plain', 'text/html', 'image/png', 'vscode-editor-data']
    if (!formats.length) return ipcRenderer.send('message', '暂无内容')
    // 构造左侧tab
    const leftDom = document.querySelector('.left')
    const frag = document.createDocumentFragment()
    formats.map(v => {
      const li = document.createElement('li')
      li.textContent = v
      li.addEventListener('click', e => handleClick(v))
      frag.appendChild(li)
    })
    leftDom.innerHTML = ''
    leftDom.appendChild(frag)
  },
  clear() {
    clipboard.clear()
    const leftDom = document.querySelector('.left')
    leftDom.innerHTML = ''
    const rightDom = document.querySelector('.right')
    rightDom.innerHTML = ''
  }
})

function handleClick(type) {
  const rightDom = document.querySelector('.right')
  switch (type) {
    case 'text/html': {
      const iframe = document.createElement('iframe')
      const html = clipboard.readHTML()
      iframe.srcdoc = html
      rightDom.innerHTML = ''
      rightDom.appendChild(iframe)
      break
    }
    case 'image/png': {
      const img = document.createElement('img')
      const imgSrc = clipboard.readImage()
      img.src = imgSrc.toDataURL()
      rightDom.innerHTML = ''
      rightDom.appendChild(img)
      break
    }
    default: {
      const text = clipboard.readText()
      rightDom.innerHTML = text
      break
    }
  }
}
