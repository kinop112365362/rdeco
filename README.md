# Structured-React-Hook

用对象重新定义 React 组件

## 安装

```js

yarn add structured-react-hook

```

## 概要

`SRH` 所指出的组件, 并非传统意义上我们所理解的 `React` 组件, 而是具有特定含义的.

其含义包括, 能够平滑拆分,具有良好扩展性和可复用性的代码才能称之为组件.

所谓平滑拆分, 即将单个工程内的代码剥离到另一个工程并导出 `NPM` 的过程是平滑无痛苦的, 不需要大动干戈, 成本很低.

而良好的扩展性在于组件能够响应各种定制化的需求, 同时保持组件核心代码的稳定

可复用性在于组件本身是可以被单独使用或者集成使用

如果你对此感到困惑, 没事让我们来看下实际的代码.

## 组件

### Component

通过 `createComponent` 创建的普通组件, 和 `React` 组件相比, 具有内置状态管理能力的组件.

```js
import { createComponent } from 'mencius'

export default createComponent({
  state: {
    name: 'component'
  },
  controller: {
    onClick () {
      this.setter.name('hello component')
    }
  },
  view: {
    render () {
      return <div onClick={this.controller.onClick}></div>
    }
  }
})
```

## 场景化指南

### 1.创建一个基础的 `Button` 组件

我们将以一个 `Button` 组件为例, 看看如何实现概要中所指出的组件的定义

最基础的 `Button` 组件, 包含点击和按钮上的文字以及简单的按钮视图, 看看代码

```js
import React from 'react'
import { createComponent } from 'mencius'

const Button = {
  name: 'Button',
  state: {
    text: '按钮'
  },
  controller: {
    onClick () {
      this.setter.text('你点了按钮')
    }
  },
  view: {
    render () {
      return (
        <button onClick={this.controller.onClick} type='button'>
          {this.state.text}
        </button>
      )
    }
  }
}

export default createComponent(Button)
```

点击按钮, 按钮文字发生改变, 这个 `demo` 展示了组件最基本的交互和视图之间的关系, 你可以亲自试试

### 2.为 `Button` 组件添加一个状态

接下来让我们给 `Button` 添加一个状态, 当每次点击的时候都记录点击的次数.

通常我们可能会考虑继续使用 `state` 来增加状态, 但这样你就需要在点击的时候修改多个状态.

一种更好的方式是将次数看成 `text` 状态的一部分, 一个变量. 具体如何来看代码

```js
import React from 'react'
import { createComponent } from 'mencius'

const Button = {
  name: 'Button',
  state: {
    text: '按钮'
  },
  ref: {
    count: 0
  },
  controller: {
    onClick () {
      this.setter.text(`你点击了 ${this.ref.count++} 次`)
    }
  },
  view: {
    render () {
      return (
        <button onClick={this.controller.onClick} type='button'>
          {this.state.text}
        </button>
      )
    }
  }
}

export default createComponent(Button)
```

你可以将 `ref` 看成是 `useRef` 那样的 hook, 但背后的原理并不相同, 本章不就此展开, 你只要记住, 使用 `ref` 可以减少不必要的状态声明.

### 3.将两个 `Button` 合二为一

看完第二个示例, 你可能会觉得为什么不能在第一个示例基础上复用代码呢? 如果那样的话不就简洁多了么?

没错, 这就是本节要展示代码复用技术 `membrane`

> `createComponent` 已经内置了 `membrane` 属性, 在此你只需要直接使用 `createComponent` 就能实现 `membrane` 的效果

来让我们看下代码, 如何复用示例 `1` 来实现示例 `2` 的定制化需求

```js
import { Button } from './demo1'

const MembranedButton = <Button membrane={
  ref: {
    count: 0
  },
  controller: {
    onClick () {
      this.setter.text(`你点击了 ${this.ref.count++} 次`)
    }
  }
}>
```

`createComponent` 的第二个参数就叫 `membrane`, 通过 `membrane` 对 `Button` 进行扩展, 你可以简单理解为 对象的 `merge`, 来构造出一个具有定制化能力的新组件.

[试试这个 Demo](https://stackblitz.com/edit/react-e2qcwy?file=src/demo3.js) 点击第三个按钮

点击过后你会发现和第二个按钮的效果是一致的, 但是节省了大量代码

### 4.为 `Button` 添加`异步请求`和 `Loading`

点击按钮发起一个请求, 过程中出现 `Loading` 这是很常见的需求, 这种通用的代码应该直接在 `demo1` 的基础上进行修改

> `mencius` 非常强调组件的设计, </br>认为组件是具有生命力的, 随着时间的推移, 需要不断的适度重构, 以保持组件健康度, 和组件设计的合理性. 这也是前端架构工作内容中的一部分.

```js
import React, { useState, useEffect, useRef } from 'react'
import { createComponent } from 'mencius'

function Loading () {
  const [text, setText] = useState('提交中')
  const textRef = useRef('提交中')
  useEffect(() => {
    const timer = setInterval(() => {
      setText((textRef.current += '.'))
    }, 300)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return <b>{text}</b>
}

const Button = {
  name: 'Button',
  state: {
    text: '按钮',
    loading: false
  },
  ref: {
    count: 0
  },
  service: {
    store (count) {
      return new Promise((resolve, rejcet) => {
        setTimeout(() => {
          localStorage.setItem('click count', count)
          resolve(false)
        }, 2000)
      })
    }
  },
  controller: {
    async onClick () {
      this.setter.loading(true)
      this.ref.count++
      const loadingState = await this.service.store(this.ref.count)
      this.setter.loading(loadingState)
      this.setter.text(`你点击了 ${this.ref.count} 次按钮`)
    }
  },
  view: {
    render () {
      return (
        <button
          disabled={this.state.loading}
          onClick={this.controller.onClick}
          type='button'
        >
          {this.state.loading ? <Loading /> : this.state.text}
        </button>
      )
    }
  }
}

export default createComponent(Button)
```

这个示例附赠了一个小的循环动画组件编写方法 😁

### 5.赋予 `Button` 跨组件通信的能力

在前几个示例中, `Button` 点击次数记录都会直接显示在 `Button` 上, 在更真实的场景下通常不会这么简单, 一般我们都会将点击的次数记录在服务端, 同时显示在某个区域.

想要实现这样的效果就必须让 `Button` 和其他组件产生通信, 在我们熟知的方案里诸如
`Redux`, `React` 文档中提到都是采用了所谓状态提升的方案.

通过在两个组件之上构建一个通信组件来实现跨组件通信.

这种方式最大的弊端在于, 通信的复杂度会对导致组件结构发生异变, 添加很多不必要的通信结构.

`Redux` 改善了这一问题, 将状态提升到单一的 `Store`, 但带来的新问题是渲染效率的下降.

为此我们认为状态提升不是解决组件通信的良好方案, 我们提出了新的思路, `combination`.

`combination` 是一种利用实例控制定向控制组件的方法. 具体如何来看看示例

```js
import React, { useState, useEffect, useRef } from 'react'
import { createComponent } from 'mencius'

function Loading () {
  const [text, setText] = useState('提交中')
  const textRef = useRef('提交中')
  useEffect(() => {
    const timer = setInterval(() => {
      setText((textRef.current += '.'))
    }, 300)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return <b>{text}</b>
}

const History = createComponent({
  name: 'History',
  state: {
    context: '目前没有点击记录'
  },
  view: {
    render () {
      return <p>{this.state.context}</p>
    }
  }
})

const Button = {
  name: 'Button',
  state: {
    text: '按钮',
    loading: false
  },
  ref: {
    count: 0
  },
  service: {
    store (count) {
      return new Promise((resolve, rejcet) => {
        setTimeout(() => {
          this.combination.History.setter.context(`你点击了按钮 ${count} 次`)
          resolve(false)
        }, 2000)
      })
    }
  },
  controller: {
    async onClick () {
      this.setter.loading(true)
      this.ref.count++
      const loadingState = await this.service.store(this.ref.count)
      this.setter.loading(loadingState)
    }
  },
  view: {
    render () {
      return (
        <>
          <button
            disabled={this.state.loading}
            onClick={this.controller.onClick}
            type='button'
          >
            {this.state.loading ? <Loading /> : this.state.text}
          </button>
          <p />
          <History />
        </>
      )
    }
  }
}

export default createComponent(Button)
```

展开代码, 你会发现在不进行状态提升的情况下, `Button` 和 `History` 组件依然建立了通信关系, 关键在这一行

```js
this.combination.History.setter.context(`你点击了按钮 ${count} 次`)
```

两个组件之间通过独立的通信通到建立联系, 而不依赖于彼此在 `jsx` 的结构, 这给跨组件通信带来了极大的便利

## API 指南

大部分 API 对三类组件都是通用的, 如果有差异, 文档中会加以说明

### this.props

`hylia` 使用 `props` 的方式和 `React` 组件略有不同, 规避了 `props` 传递的一些问题

```js
import { createComponent } from 'mencius'

const coma = createComponent({
  view: {
    render () {
      return <div>{this.props.text}</div>
    }
  }
})

function comb () {
  return <coma text='hello' />
}
```
