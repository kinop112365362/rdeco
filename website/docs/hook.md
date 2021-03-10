---
id: hook
title: Hook
sidebar_label: Hook
slug: /hook
---

Hook 是一种特殊的结构, 用于实现 AOP 编程的效果, 目前已经具备的 Hook 有

- before[Controller/全部/单个]
- after[Controller/全部/单个]
- render[View/全部/单个]Wrapper

通过例子会比较容易理解
```js
controller:{
  onButtonClick(){},
  onResetButtonClick(){}
}
view:{
    renderMain(){return(<div>main</div>)},
    renderSub(){return(<div>sub</div>)}
}
hook:{
    beforeController(){} // 在所有 Controller 执行前执行
    afterController(){} // 在所有 Controller 执行后执行
    renderWrapper(renderTarget, renderKey){} // 在所有 render 函数外层包裹些什么
}
```