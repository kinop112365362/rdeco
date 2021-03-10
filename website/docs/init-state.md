---
id: init-state
title: InitState
sidebar_label: InitState
slug: /init-state
---

initState 是应用/组件的核心数据, 用来声明应用/组件在前端角度的应用模型.

#### 状态的分类

在 srh 中我们将状态分为几种不同的类型

- 控制视图的状态
- 用于显示的单行文本/数值
- 复杂的渲染模型(可能同时包含以上两种)
  - 对象
  - 数组
- 样式

#### 声明 initState

```js
initState: {
  name: 'srh'
}
```

也可以为 initState 创建惰性初始化函数

```js
initState: [{ name: 'src' }, state => state]
```

#### 操作 initState

当你在 Store 中声明了 initState, srh 会为你自动生成对应的操作函数

```js
name: 'srh'

this.rc.setName('hello world') // this.state.name → hello world
```

就如同 React this.setState 表现的那样, 操作 state 会触发 render, 和 React this.setState 不同的是

自动生成的操作函数会包含顶层的 setState 和对应的 二级 KEY, 例如

```js
initState:{
    name: 'srh',
    detail: {
        income: 40000
    }
}
```

上述 initState 会自动生成 this.rc.setName 和 this.rc.setDetail 两个操作函数, 用于操作局部的 initState

至于 this.rc.setState 是作为顶层 API, 操作的是整个 initState, 和局部操作函数的区别在于

```js
this.rc.setState(prevState => nextState) // 此处 state 等于 initState
// 特别注意的是, set 操作, 如果传入的是对象, 将会和原有对象进行 deep merge, 如果传入的是数组, 则会覆盖原数组.
this.rc.setName(prevState => nextState) // 此处 state 等于 'srh'
```

如上述所示, 操作函数支持传入值或者函数, 支持传入函数可以更方便的获取 prevState