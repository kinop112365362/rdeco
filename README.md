# Structured-React-Hook

> Structured-React-Hook 以下简称 srh

## 快速开始

使用 srh 非常简单

```js

yarn add structured-react-hook

```

```js
import React, { useEffect } from 'react'
import createStore from 'structured-react-hook'

const storeConfig = {
  initState: {
    text: ''
  },
  controller: {
    onComponentInit () {
      this.rc.setText('hello world')
    }
  }
}
const useStore = createStore(storeConfig)

function App () {
  const store = useStore()
  useEffect(() => {
    store.controller.onComponentInit()
  }, [])
  return <div>{store.state.text}</div>
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
    onA(){},
    onB(){this.controller.onA()} // 会报错, Controller 的上下文不包括他自己
}
```

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
this.rc.setName(prevState => nextState) // 此处 state 等于 'srh'
```

如上述所示, 操作函数支持传入值或者函数, 支持传入函数可以更方便的获取 prevState

### Ref

```js
ref:{
    time:0
}

this.refs.time.current → 0
```

ref 和 useRef 等价, ref 可以用在保存引用的场景, 和 state 不同是, 修改 ref 并不会导致 render,

你可以像修改普通的变量一样修改 ref

```js
this.refs.time.current = 1
```

ref 可以用来表示那些需要被保存但是又不需要被 View 消费的值. 包括 dom 实例, 标记等

### Styles

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

> 关于扩展部分参看 Membrane
### 函数结构上下文

在 Store 中 View Service Controller 等函数结构都拥有自己的上下文, 这个上下文大部分相同, 仅有部分框架对其做了限制
上下文包括

- state : this.initState
- refs : this.refs
- styles : this.styles
- service : this.service(仅限 Controller 和 Service)
- controller : this.controller(仅限 View 和 Combination 下的 Controller)
- view: this.view(仅限 View)
- rc: this.rc(仅限 Controller 和 Service)
- context: this.context(当存在 GlobalStore 时)
- props: this.props(仅限 Membrane)
- combination: this.combination(仅限 Controller)
### Service
Service 是逻辑的末端, 在 View  → Controller → Service 这样的链路中, Service 和 Controller 的区别在于 Service 可以互相调用, 例如

```js
service:{
    a(){},
    b(){
        this.service.a()
    },
}

```

而  Controller 则不行, 这样设计的原因是为了避免 Controller 复杂化且失去语义, 另外 View 拿不到任何 Service, 除此之外, Service 和 Controller 没有什么不同

### Controller

Controller 相比 Service 更严格, 命名上有语义化限制, 必须以 on[名词][动词] 来进行命名, 我们建议使用 on + 元素名 + [Click/Change/Mount...] 等方式来命名 Controller, 实际运行中, 除了 on 开头其余并不做校验, 因此你可以自己定义一套命名规则, 确保团队基于这个规则能够有理解上的共识

Controller 和 Service 内部都可以拿到 this.rc 操作 initState 来更新 View
### View

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

render 函数的命名没有限制, 但 srh 配套的分析工具可能需要指定入口函数, 我们建议在每个 View 中都使用 render 来作为入口渲染函数

### Hook

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
    beforeButtonClick(){} // 在 onButtonClick 执行前执行
    afterResetButtonClick(){} // 在 onResetButtonClick 执行后执行
    renderWrapper(renderTarget, renderKey){} // 在所有 render 函数外层包裹些什么
    renderMainWrapper( renderTarget, renderKey){} // 只在 renderMain 外部层包裹些什么
}
```

### Combination

对于一个复杂的巨大的应用/组件, 我们需要设计多个不同业务领域的 Store, Combination 就是为了多 Store 通信的问题
看例子
```js
const subStoreConfig = {
    name:'sub',
    initState:{
        name:'jacky'
    },
    controller:{
        onNameChange(name){
            this.rc.setName(name)
        }
    }
}
const mainStoreConfig = {
    initState:{},
    controller:{
        onButtonClick(){
            this.combination['sub'].onNameChange('ann')
        }
    }
}

所有 Store 都可以拥有自己的 name, 但大多数情况下我们并不需要刻意的命名, 使用匿名 Store 更加方便, 只有当你需要将 Controller 暴露给其他 Store 的时候, 你可以使用具名 Store
```
### Membrane

Membrane 是一种基于相同结构的对象重载的 Store 扩展方式, 基于 Membrane 扩展 Store 可以实现 0 参数情况下对原有的 Store 100% 扩展, 同时避免产生两个无法归源的版本, 归源问题将有助于实现微前端的模式, 即各自维护各自不同的代码, 但又共享彼此相同的部分

```js
// base 团队维护的组件
const createBaseComponent = (membrane={controller:{}})=>{
    const useStore = createStore({
        initState:{
            name:'jacky'
        },
        controller:{
            onButtonClick(){
                this.rc.setName('hello world')
            }
        }
    })
    function Base(){
        const store = useStore()
        return(
            <div>
                <button onClick={store.controller.onButtonClick}> click me</button>
            </div>
        )
    }
}

export default createBaseComponent

// other 团队维护的组件扩展
import createBaseComponent from 'base-component'

createBaseComponent({
    controller:{
        onButtonClick(){
            this.rc.setName('other')
        }
    }
})

```
这样 other 团队得到了一个点击 name = other 版本, 而 base 团队继续维护 name = jacky 的版本

other 团队可以将自己的扩展版本独立发布, base 团队和 other团队可以并行维护各自的代码, 而不需要彼此关心对方的需求.

## 进阶内容

- [提升渲染性能的技巧](#提升渲染性能的技巧)
- [调试技巧](#调试技巧)
- [GlobalStore](#GlobalStore)

### 提升渲染性能的技巧

### 调试技巧

### GlobalStore
