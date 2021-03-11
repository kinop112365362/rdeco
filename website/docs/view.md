---
id: view
title: View
sidebar_label: View
slug: /view
---

普通的 render 函数, 除了内置了函数结构上下文, 和 React 下的 Function Component 是一样的.
```js
view:{
    renderSub(){
        return(
            <div>renderSub<div>
        )
    },
    render(){
        return(
            <div>{this.view.renderSub()}</div>
        )
    }
}
输出:
<div>
  <div>
    renderSub
  </div>
</div>
```

SRH 限制 render 函数必须以 render 开头, 这是强制代码风格, 同时也是为了能够从约定中获益, 尤其是对于框架的解析引擎来说, 约定相同的名称, 有助于解决很多需要分析函数名才能实现的效果.

SRH 内置了一个非常有趣的功能, 用来解决诸如 Vue 中 if 指令那样的效果, 只是更加的智能化.

```js
const storeConfig = {
    view:{
        renderName(){
            return (
                <div>{this.state.name}</div>
            )
        }
    }
}

```

在这个例子中, 通常我们会需要对 renderName 进行渲染控制的场景, 比如一些 if 判断, 来决定是否渲染, 就像 Vue 的 if 指令那样.

但是在 React 中只能通过声明一个 state 来实现

```js
initState:{
    renderName:true
},
view:{
    render(){
        return(
            <>
                {this.state.renderName && this.view.renderName()}
            </>
        )
    }
}


```

当开发了一段时间以后, 你会发现这种用来控制渲染的状态越来越多, 变得难以维护, 同时让我们的代码看起来也不那么优雅了.

SRH 解决了这个问题, 通过分析 View 的结构在初始化的时候自动给每个 render 函数绑定了一个可以控制渲染的变量

```js

this.rc.setViewCtrl({
    renderName:false
})

```


开发者不需要在为这种控制变量做声明, 只要自然的分隔 View 到不同的 render 函数就能实现对渲染的控制