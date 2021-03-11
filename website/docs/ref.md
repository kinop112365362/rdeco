---
id: ref
title: Ref
sidebar_label: Ref
slug: /ref
---

```js
ref:{
    time:0
}

this.refs.time → 0
```

ref 和 useRef 等价, ref 可以用在保存引用的场景, 和 state 不同是, 修改 ref 并不会导致 render,

你可以像修改普通的变量一样修改 ref, 为了提升性能, SRH 在最新的版本中重构了 Ref 的逻辑, 不再通过 useRef

来间接保存

```js
this.refs.time = 1
```

ref 可以用来表示那些需要被保存但是又不需要被 View 消费的值. 包括 dom 实例, 标记等