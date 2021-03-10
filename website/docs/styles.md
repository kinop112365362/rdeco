---
id: styles
title: Styles
sidebar_label: Styles
slug: /styles
---

styles 是个普通的对象, 如果你采用 @emotion 那样的 css in js 方案, 你会需要它. srh 推荐使用 @emotion 那样的

css in js 方案来编写样式, 这样可以在组件和应用内内聚样式, 让应用/组件更易于扩展, 同时将 state 中的 styles 和 css

中的 styles 进行统一, 例如, 当我们点击某个按钮, 按钮需要修改背景色和边框的时候.

```js
initState:{
    buttonClicked:0
},
styles:{
    button:{
        background:'#fff',
        border:'1px solid #fff'
    }
}
controller:{
    onButtonClick(){
        this.styles.button.background = '#000',
        this.styles.button.border = '1px solid #000'
        this.rc.setButtonClicked(state=>state++)
    }
}
```

区分 styles 和 state 有助于避免混淆 initState 中的状态. 同时也可以降低复杂动态样式实现的难度, 提升性能