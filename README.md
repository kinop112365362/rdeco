# Structured-React-Hook
> Structured-React-Hook 一下简称 srh

## 快速开始

使用 srh 非常简单
```js

yarn add structured-react-hook

```

```js
import React,{useEffect} from 'react'
import createStore from 'structured-react-hook'

const storeConfig = {
    initState:{
        text: ''
    },
    controller:{
        onComponentInit(){
            this.rc.setText('hello world')
        }
    }
}
const useStore = createStore(storeConfig)

function App(){
    const store = useStore()
    useEffect(()=>{
        store.controller.onComponentInit()
    },[])
    return(
        <div>{store.state.text}</div>
    )
}

```
## 概念

### 设计
- [Overview](#Overview)
### 核心
- [InitState](#InitState)
- [Controller](#Controller)
- [Service](#Service)
- [View](#View)
### 附加
- [Combination](#Combination)
- [Ref](#Ref)
- [Styles](#Styles)
- [Hook](#Hook)

### 灵魂
- [Membrane](#Membrane)
### OverView


srh 是一个遵循开闭原则, 以结构化为核心的应用状态管理框架, srh 将应用/组件理解为一个结构化的对象, 我们称之为 Store

#### Store

Store 是一个标准的普通的 JavaScript 对象, 拥有扁平的可扩展结构, srh 的新增特性都是以对象属性的方式来扩展的.

```js
// 早期版本
const storeConfig = {
    initState,
    service,
    controller,
    view,
    membrane
}
// 1.10.0
const storeConfig = {
    initState,
    ref,
    styles,
    service,
    controller,
    view,
    hook,
    membrane
}

```
如上所见, 特性仅仅是 Store 对象的属性的一部分, 我们通过对对象结构的定义来增强 Store, 提供更强大的能力. 同时保持向下兼容.

#### 基于 useReducer Hook

srh 目前仅支持 react, 对于 react 状态管理, 内部使用了 useReducer hook 同时做了封装和隐藏, 屏蔽了 action dispatch 这样的概念.
对于开发者而言, 你并不会感受到 useReducer 或者类 redux api 的存在.

#### 有益编程特性的集合

srh 吸收了诸如 AOP 的切面设计, OO 的开闭原则, 函数重载, 同时保留了 JavaScript 对象的灵活性.

#### 函数结构的独立上下文

srh 为函数类结构构建了特殊的上下文, 指向函数中的  this, 上下文集成了一些规则用来避免一些常见的开发不良习惯,
这些规则大致上遵循单向调用, 循环可控, 两层扁平结构等. 通俗的讲, View 只能调用 Controller, Controller 只能调用 Service, View 和 Service 可以互相调用, Controller 则不行.

### InitState

initState 是应用/组件的核心数据, 用来声明应用/组件在前端角度的应用模型.

#### 状态的分类

在 srh 中我们将状态分为几种不同的类型

- 控制视图的状态
- 用于显示的单行文本/数值
- 复杂的渲染模型(可能同时包含以上两种)
  - 对象
  - 数组
- 样式

> 在 1.10.0 版本中, 我们将样式分离出来单独作为 styles 进行管理, 其余的分类后续会随着版本提供分类结构, 

### Combination
### Ref

### Styles

### Service
### Controller

### View

### Hook

### Membrane

## 进阶内容

- [提升渲染性能的技巧](#提升渲染性能的技巧)
- [调试技巧](#调试技巧)
- [GlobalStore](#GlobalStore)

### 提升渲染性能的技巧

### 调试技巧

### GlobalStore