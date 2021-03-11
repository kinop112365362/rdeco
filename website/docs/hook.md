---
id: hook
title: Hook
sidebar_label: Hook
slug: /hook
---

Hook 是一种特殊的结构, 用于实现 AOP 编程的效果, 目前已经具备的 Hook 有

- serviceWrapper
- controllerWrapper
- viewWrapper

如果你对 AOP 感兴趣可以查阅 wiki, 此处不再赘述, 那么 hook 能帮助我们做什么?

在面向对象编程中, 通常我们对父类方法的复用是通过继承来实现的, 例如

```js
class Father {
  todo () {}
}
class Child extends Father {
  constructor () {
    super()
  }
  todoYo () {
    // before...
    super.todo()
    // after
  }
}
```

但是在 SRH 中并不提供类似继承的能力, 因为我们出于对继承的一些诟病而放弃了这一特性, 就如上述例子中的, 通过继承实现对源函数的复用, 当继承多次之后可能会形成非常复杂的调用链条, 这不仅不利于性能, 更不利于维护.

因此我们采用 AOP 的方式来复用源函数.

### viewWrapper

```js
const storeConfig = {
  view: {
    render () {
      return <div> hello world </div>
    }
  },
  hook: {
    viewWrapper (render, renderKey, ...args) {
      return (
        <>
          <div> jacky </div>
          {render(...args)}
        </>
      )
    }
  }
}
```

### ctrlWrapper

```js
const storeConfig = {
  initState: {
    name:'jacky'
  },
  controller:{
    onButtonClick(str){
      this.rc.setName(str)
    }
  },
  view:{
    render(){
      return(
        <>
          <div>{this.state.name}</div>
          <button onClick={e=>{this.controller.onButtonClick('lil')}}> change name </button>
        </>
      )
    }
  },
  hook:{
    ctrlWrapper(ctrl, ctrlKey, ...args){
      if(ctrlKey === 'onButtonClick){
        return ctrl('hello' + args[0])
      }
      return ctrl(...args)
    }
  }
}
```

Service 和 Controller 模式一样, 就不举例了, hook 具备部分 AOP 和 反射的特征, 可以在运行时劫持原函数, 同时根据原函数的函数名进行逻辑匹配. 不过要注意的是当你使用 hook 的时候一定要记得最终返回原函数, 就像 redux 的 reducer 得返回默认 state 一样