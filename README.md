# Structured-React-Hook

面向企业级的次世代 React 应用/组件研发框架

先来安装下
```js
yarn add structured-react-hook

```

这是一个基本示例, 声明状态, 通过控制器修改状态触发渲染

```js
import React, { useEffect } from 'react'
import createStore from 'structured-react-hook'

const storeConfig = {
  initState: {
    text: ''
  },
  controller: {
    onComponentInit () {
      this.rc.setText('hello world')
    }
  }
}
const useStore = createStore(storeConfig)

function App () {
  const store = useStore()
  useEffect(() => {
    store.controller.onComponentInit()
  }, [])
  return <div>{store.state.text}</div>
}
```

So Easy!!

更详细的文档见库官网 https://kinop112365362.github.io/structured-react-hook/
