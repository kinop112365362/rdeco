---
id: overview
title: 总体设计
sidebar_label: 总体设计
slug: /overview
---

srh 是一个遵循开闭原则, 以结构化为核心的应用研发框架, srh 将应用/组件理解为一个结构化的对象, 我们称之为 Store

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

srh 为函数类结构构建了特殊的上下文, 指向函数中的 this, 上下文集成了一些规则用来避免一些常见的开发不良习惯,
这些规则大致上遵循单向调用, 循环可控, 两层扁平结构等. 通俗的讲, 应该是  View 内的 render 函数可以互相调用 Service 下的函数也可以, 但是 Controller 下的函数不能互相调用, 来看例子
```js
view:{
    renderSub(){return (<div></div>)}
    render(){
        return(
            <div>{this.view.renderSub()</div>
        )
    }
}
service:{
    a(){},
    b(){this.service.a()},
}
// 以上都是可行的, 但下面的不行
controller:{
    onA(){this.view.render()}, //这也不行
    onB(){this.controller.onA()} // 会报错, Controller 的上下文不包括他自己
}
view:{
    render(){
        this.service.a() // 这个也不行
    }
}
service:{
    a(){
        this.controller.onA() // 🚫 error
        this.view.render() // 🚫 error
    }
}

```
#### 函数结构上下文说明

在 Store 中 View Service Controller 等函数结构都拥有自己的上下文, 这个上下文大部分相同, 仅有部分框架对其做了限制
上下文包括

- state : this.initState
- refs : this.refs
- styles : this.styles
- service : this.service(仅限 Controller 和 Service)
- controller : this.controller(仅限 View 和 Combination 下的 Controller)
- view: this.view(仅限 View 和 Controller)
- rc: this.rc(仅限 Controller 和 Service)
- context: this.context(当存在 GlobalStore 时)
- props: this.props(暂时不可用, 讨论中))
- combination: this.combination(仅限 Controller 和 View)