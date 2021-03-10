---
id: quick-start
title: 上手
sidebar_label: 快速开始
slug: /
---

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