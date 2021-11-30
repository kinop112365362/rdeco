# Rdeco

## Rdeco 是什么?

Rdeco 是什么? Rdeoc 是一个基于 Rx.js 的前端应用研发框架, 用于开发从简单组件到复杂大型应用的全流程框架

## Rdeco 包含哪些模块

Rdeco 包含以下模块用于前端应用研发的不同场景和需求

1. @rdeco/router5 一个基于 router5 的路由系统, 用于开发 spa 应用下的路由

2. @rdeco/core 基于 Rx.js 的核心库, 提供了开发响应式模块的核心功能

3. @rdeco/react 用于快速开发 react 组件, Rdeco 的架构并不和任何 UI 库绑定, 后续我们会开发和其他 UI 库集成的包

## 快速开始

### 安装

```js
yarn add rdeco
```

> rdeco 内部模块目前没有拆包, 都统一从 rdeco 导出

## @rdeco/core

`@rdeco/core` 是一个 UI 无关的核心库，底层基于 rx.js，理论上 rdeco 可以为任何 UI 库提供事件化的状态管理能力。

但和主流的状态管理库不同，`@rdeco/core` 其实是一种响应式的编程范式库。

通常 JavaScript 开发是面向对象的，但有时候你也可以使用类似函数式那样的风格，rx.js 提出的响应式编程也是基于函数式的，

rdeco 在这里做了些调整，我们在 JavaScript 的普通对象上加入了 rx.js 的响应式能力，于是面向对象变成了面向响应式对象。

## 响应式对象和普通对象

### 普通对象

```js
const helloWorld = {
  text: 'hello world',
  print() {
    console.log(this.text)
  },
}

const code = {
  type: 'javascript',
  getType() {
    console.log(this.type)
  },
}
```

普通对象的特征就是抽象具有内聚性，在对象的内部你可以创建属性和方法来模拟真实世界的其他事物。但是真实世界事物之间是有沟通的，可能是单向，也可能是双向，而普通对象并不具备通信能力，当两个对象需要沟通的时候，往往需要建立一种依赖关系，在相同的环境中才能执行。比如上述例子

```js
code.callHelloWroldPrint = () => {
  helloWorld.print()
}
```

code 对象如果要通知 helloWorld 对象去执行 print 方法 就需要获取到 helloWorld 对象的实例并对其直接进行操作。这种依赖关系让对象之间不得不建立起一个网状关系。并且这种网状关系是不可分割的，切不能被时间和空间所切分，这导致基于普通对象的建模方法很难真正实现对现实世界的抽象。

因为虽然现实世界中的各个对象之间的关系也是网状关系，但是我们的网状关系是可以切分到不同的时间和空间中去的，这就让对象之间的互操作变得不那么强调时间和空间的一致性。

举个最简单的例子，你通知你朋友在某天去参加一个活动，并不需要把你的朋友叫到跟前当面嘱咐他，这是因为我们拥有各种通信工具（电话、信件……）和通信标识（家庭住址，名字，地址，邮编……）

而编程本质上是将现实世界虚拟化的一个过程，为了能够做到这一点，我们需要一种能够模拟现实世界的这种通信机制的方式来让普通对象能够在不同的时间和空间上互操作。

而这正是 `@rdeco/core` 的意义。

rdeco 为普通对象添加了比订阅发布更强大的响应式机制， 这种机制可以让普通对象在不同的时间和空间上互操作。

### 响应式对象

让我们创建两个分布在不同空间，不同时间加载的对象，通常不同空间是指发布到不同的资源服务器上，例如我们将 jacky 对象发布到 `cdn.a/jacky.js`

```js
import { create } from 'rdeco'

create({
  name: 'jacky',
  state: {
    age: 19,
  },
  exports: {
    setAge(newAge) {
      this.controller.setAge(newAge)
    },
    getAge(next) {
      next(this.state.age)
    },
  },
  controller: {
    setAge() {
      this.setter.age(20)
    },
  },
})
```

这个 jacky 对象暴露了 2 个方法可供其他对象调用， 同时在调用 printAge 的时候会设置自己的 age 从 19 → 20 。

然后我们再创建另一个对象 ann， 并将其发布到 `cdn.b/ann.js`

```js
import { create, inject } from 'rdeco'

create({
  name: 'ann',
  subscribe: {
    jacky: {
      state: {
        age({ nextState }) {
          console.log(nextState)
        },
      },
    },
  },
  controller: {
    onStart() {
      inject('jacky')
        .getAge()
        .then((age) => {
          inject('jacky').setAge(age + 1)
        })
    },
  },
})
```

对象 ann 在初始化的时候调用了 jacky 对象的 getAge 方法获取到当前 jacky 的 age，同时 + 1 后调用 jacky 的 setAge 方法更新 jacky 的 age，我们将其类比成现实世界的模型。

`ann 问 jacky 多大了？ jacky 回答 19， ann 说那你得虚岁应该是 20`

如果这件事发生在同一空间和时间下，比如 ann 和 jacky 面对面在一个下午偶遇闲聊了下， 那么你使用普通对象就能抽象这件个过程。 但如果 ann 和 jacky 是两个国家的人，并且时区不同， ann 早上发消息问 jacky， jacky 此时还在睡觉，等 jacky 回复的时候 ann 又睡觉了。 那么普通对象就无法抽象这个过程，因为两者的空间和时间并不相同。

反面来讲，这种时间和空间上的无法分割也导致了，前端 JavaScript 代码只能堆积却不能拆分的原因。因为我们编写的模块，npm 里的包必须被 download 到本地然后在同一时间和空间中运行才能正常互操作。

只有极少数环境级的模块能被放到 cdn 上，打破空间上的依赖，但即便如此，你并不能在 react 加载之前运行 react.createElement 对么。 这依然是一种时间上的依赖。

## API

响应式对象包含一组互操作的 API，你通过这组 API 可以让两个响应式对象摆脱对时间和空间的依赖进行互操作

### exports

exports 用来暴露可以被 inject 后调用的方法。

```js
inject('mdoule-a').foo()

create({
  name: 'module-a',
  exports: {
    foo() {
      console.log('foo')
    },
  },
})

// log foo
```

#### 通过 next 返回调用结果

如果你需要在 exports 暴露的方法中传递一些值给调用方，可以使用 next， next 函数在所有 exports 暴露的方法中都存在

```js
inject('mdoule-a')
  .foo()
  .then((foo) => {
    console.log(foo)
  })

create({
  name: 'module-a',
  exports: {
    foo(next) {
      next('foo')
    },
  },
})
// log foo
```

### inject

inject 用来给目标模块发送指令，这个过程并不需要目标模块真实就绪，就好比你给对方写信，并不需要知道对方在不在家。

- inject([moduleName]) => exports

### subscribe

subscribe 用来响应目标对象的一系列操作

- subscribe.state[key]({nextState, prevState, state})

```js
create({
  name: 'foo',
  subscribe: {
    bar: {
      state: {
        name({ nextState }) {
          console.log(nextState)
        },
      },
    },
  },
})

const bar = create({
  name: 'bar',
  state: {
    name: null,
  },
  controller: {
    onNameSet(name) {
      this.setter.name(name)
    },
  },
})

bar.controller.onNameSet('foo')

//console.log foo
```

- subscribe.event[key](...args)

event 和 emit api 是一组关系 api，目标对象可以通过 emit 让其他对象能够响应对应的 event 函数

```js
create({
  name: 'foo',
  subscribe: {
    event: {
      nameSetOver(name) {
        console.log(`hello ${name}`)
      },
    },
  },
})

const bar = craete({
  name: 'bar',
  state: {
    name: null,
  },
  controller: {
    onStart() {
      this.setter.name('bar')
      this.emit('nameSetOver', 'bar')
    },
  },
})
bar.conroller.onStart()

// console.log hello bar
```

- subscirbe.controller[key](..args)
- subscirbe.service[key](..args)

controller 和 service 只是一组 event 的快捷语法，避免你过多的声明类似的 emit 事件函数

### 为什么 event 不能使用 next 来返回值？

和 exports 不同 subscribe 本质是一种广播模式，如果提供 next 返回值会导致一些意想不到的情况发生。所以如果你需要在响应 event 之后返回结果给调用对象，应该通过 exports 暴露的方法。 虽然这样可能会有点绕， 但对于跨越了时间和空间的通信来说，收发的准确性和流向的可控性更为重要

## 集成 React

### 用一个 todomvc 来说明 rdeco 如何快速开发一个 react 组件

```js
import React from 'react'
import { createComponent } from 'rdeco'

export default createComponent({
  name: 'todomvc',
  state: {
    todolist: [
      { text: '起床', check: false },
      { text: '吃饭', check: false },
      { text: '睡觉', check: false },
    ],
    newTodoValue: '',
  },
  controller: {
    onChange(e, index) {
      this.state.todolist[index].check = e.target.checked
      this.setter.todolist(this.state.todolist)
    },
    onNewTodoChange(e) {
      this.setter.newTodoValue(e.target.value)
    },
    onDeleteClick(index) {
      this.setter.todolist(
        this.state.todolist.filter((v, i) => {
          return i !== index
        })
      )
    },
    onClick() {
      this.state.todolist.push({
        check: false,
        text: this.state.newTodoValue,
      })
      this.setter.todolist(this.state.todolist)
      this.setter.newTodoValue('')
    },
  },
  view: {
    render() {
      return (
        <div className="App">
          <ul>
            {this.state.todolist.map((todo, index) => {
              return (
                <li key={todo.text}>
                  <input
                    onChange={(e) => this.controller.onChange(e, index)}
                    checked={todo.check}
                    type="checkbox"
                  />
                  {todo.text}
                  <button onClick={() => this.controller.onDeleteClick(index)}>
                    删除
                  </button>
                </li>
              )
            })}
          </ul>
          <input
            type="text"
            onChange={this.controller.onNewTodoChange}
            value={this.state.newTodoValue}
          />
          <br />
          <br />
          <button onClick={this.controller.onClick}>添加待办事项</button>
        </div>
      )
    },
  },
})
```

在线示例: <https://codesandbox.io/s/romantic-yalow-9ewds>

### Rdeco 的应用架构模式

快速开始中的示例展示了一种快速开发模式, 这种模式让编写的组件足够内聚, 并且组件内部有非常好的分层设计, 但对于较为复杂的应用来说往往需要开发多个组件, 并且为这些组件建立通信关系以便于交换和同步状态.

因此你需要了解的进阶的应用架构模式, 我们称为`复杂模式`. 让我们看看如何将`简单模式` 下的 todomvc 修改成复杂模式下的版本. 为了让这个示例更接近真实, 我们利用 localStorage 来模拟数据库, 提供一些异步接口, 让 todomvc 能够具备持久化数据的能力

```js
import React from 'react'
import { create, createComponent } from 'rdeco'

const todomvcService = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (localStorage.getItem('todolist')) {
      resolve(JSON.parse(localStorage.getItem('todolist')))
    } else {
      resolve([
        { text: '起床', check: false },
        { text: '吃饭', check: false },
        { text: '睡觉', check: false },
      ])
    }
  }, 100)
})

const todomvcModel = create({
  name: 'todomvc-model',
  state: {
    todolist: [],
  },
  subscribe: {
    'todomvc-model': {
      state: {
        todolist({ nextState }) {
          localStorage.setItem('todolist', JSON.stringify(nextState))
        },
      },
    },
  },
  controller: {
    onMount() {
      todomvcService.then((data) => {
        this.setter.todolist(data)
      })
    },
    onCompleteTodo(index, checked) {
      this.state.todolist[index].check = checked
      this.setter.todolist(this.state.todolist)
    },
    onAddTodo(text) {
      this.state.todolist.push({
        text,
        check: false,
      })
      this.setter.todolist(this.state.todolist)
    },
    onDeletTodo(index) {
      this.setter.todolist(
        this.state.todolist.filter((v, i) => {
          return i !== index
        })
      )
    },
  },
})

export default createComponent({
  name: 'todolist',
  subscribe: {
    'todomvc-model': {
      state: {
        todolist({ nextState }) {
          this.setter.todolist(nextState)
        },
      },
    },
  },
  state: {
    todolist: todomvcModel.state.todolist,
    newTodoValue: '',
  },
  controller: {
    onChange(e, index) {
      todomvcModel.controller.onCompleteTodo(index, e.target.checked)
    },
    onNewTodoChange(e) {
      this.setter.newTodoValue(e.target.value)
    },
    onDeleteClick(index) {
      todomvcModel.controller.onDeletTodo(index)
    },
    onClick() {
      todomvcModel.controller.onAddTodo(this.state.newTodoValue)
      this.setter.newTodoValue('')
    },
  },
  view: {
    render() {
      return (
        <div className="App">
          <ul>
            {this.state.todolist.map((todo, index) => {
              return (
                <li key={todo.text}>
                  <input
                    onChange={(e) => this.controller.onChange(e, index)}
                    checked={todo.check}
                    type="checkbox"
                  />
                  {todo.text}
                  <button onClick={() => this.controller.onDeleteClick(index)}>
                    删除
                  </button>
                </li>
              )
            })}
          </ul>
          <input
            type="text"
            onChange={this.controller.onNewTodoChange}
            value={this.state.newTodoValue}
          />
          <br />
          <br />
          <button onClick={this.controller.onClick}>添加待办事项</button>
        </div>
      )
    },
  },
})
```

在线示例: <https://codesandbox.io/s/romantic-yalow-9ewds?file=/src/Complex.js:0-2383>
