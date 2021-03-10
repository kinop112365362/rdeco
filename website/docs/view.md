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

render 函数的命名没有限制, 但 srh 配套的分析工具可能需要指定入口函数, 我们建议在每个 View 中都使用 render 来作为入口渲染函数, 同时将其他 render 函数都已 render 开头