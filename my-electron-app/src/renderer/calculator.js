;(function () {
  const numberKeys = Array.from({ length: 10 }, (_, i) => `${i}`).concat('.')
  const operationKeys = ['+', '-', '×', '÷', '=']

  input.addEventListener('click', ({ target }) => {
    const { innerHTML, dataset } = target
    const value = dataset.value || innerHTML
    console.log('value', value)
    output.dataset.lastkey = value
    if (clear === target) return clearOutput()
    // if (sign === target) TODO
    if (numbers.contains(target)) return setNumber(value)
    if (operators.contains(target)) return setOperator(value)
  })

  document.addEventListener('keyup', ({ key }) => {
    console.log('keyup', key)
    if (key === 'Escape') return clearOutput()
    if (numberKeys.includes(key)) return setNumber(key)
    if (operationKeys.includes(key)) return setOperator(key)
  })

  function clearOutput() {
    output.dataset.value1 = '0'
    output.dataset.value2 = '0'
    output.dataset.operator = ''
    output.innerHTML = '0'
  }

  // 输入数字根据上下文设置为 value1 或 value2
  function setNumber(digit) {
    output.dataset.lastkey === '=' && clearOutput() // 如果最后一个键是'='则初始化
    // 根据你是否输入了4个算术运算，填写不同的位置
    !output.dataset.operator ? printNumber(digit, 'value1') : printNumber(digit, 'value2')
  }

  function printNumber(digit, value) {
    if (output.dataset[value].length >= 10) return // 超过10位返回
    if (digit === '.' && /\./.test(output.dataset[value])) return // 连续取小数点时返回
    if (/\d|\./.test(output.dataset.lastkey)) {
      output.dataset[value] += digit
    } else {
      output.dataset[value] = digit
    }
    if (/^0\d/.test(output.dataset[value])) {
      output.dataset[value] = output.dataset[value].replace(/^0/, '') // 删除开头的0
    }
    const valueArray = output.dataset[value].split('.') // 按小数点分割显示逗号，放入数组
    valueArray[0] = parseFloat(valueArray[0]).toLocaleString() // 每 3 位整数显示逗号
    output.innerHTML = valueArray.join('.') // 连接小数点后输出
    console.log('output: ' + output.innerHTML) // TODO: 删除
  }

  function setOperator(currentOperator) {
    const operator4thArray = ['+', '-', '×', '÷']
    const isLastKey4thOperator = operator4thArray.indexOf(output.dataset.lastkey) > -1 // 最后一个键是算术运算符
    const isCurrentKey4thOperator = operator4thArray.indexOf(currentOperator) > -1 // 当前键为算术运算符
    const last4thOperator = output.dataset.operator

    // 没有运算符集或 || 反复按四项算术运算时
    if (!last4thOperator || (isLastKey4thOperator && isCurrentKey4thOperator)) {
      output.dataset.operator = currentOperator // 仅设置并返回最后一个运算符
      return
    }
    if (isLastKey4thOperator && currentOperator === '=') {
      // 四次算术运算后，当按下结果键时，
      output.dataset.value2 = output.dataset.value1 // 复制显示的value1值到第二个值
    }

    const value1 = output.dataset.value1
    const value2 = output.dataset.value2
    const resultValue = calculate(last4thOperator, value1, value2)

    output.dataset.value1 = resultValue //将计算结果保存到value1
    output.innerHTML = resultValue.toLocaleString() // 在计算结果中添加逗号并显示在屏幕上

    setTimeout(() => {
      console.log('output: ' + output.innerHTML)
    }, 0)

    if (isCurrentKey4thOperator) {
      // 如果您单击了 4 运算符，请保存 4 运算符
      output.dataset.operator = currentOperator
    }
  }

  function calculate(operator, value1, value2) {
    if (operator === '+') {
      return parseFloat(value1) + parseFloat(value2)
    } else if (operator === '-') {
      return parseFloat(value1) - parseFloat(value2)
    } else if (operator === '×') {
      return parseFloat(value1) * parseFloat(value2)
    } else if (operator === '÷') {
      return parseFloat(value1) / parseFloat(value2)
    }
  }
})()
