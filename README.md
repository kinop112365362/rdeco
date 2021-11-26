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
import React from "react";
import { create, createComponent } from "rdeco";

const todomvcService = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve([
      { text: "起床", check: false },
      { text: "吃饭", check: false },
      { text: "睡觉", check: false }
    ]);
  }, 100);
});

const todomvcModel = create({
  name: "todomvc-model",
  state: {
    todolist: []
  },
  subscribe: {
    "todomvc-model": {
      state: {
        todolist({ nextState }) {
          localStorage.setItem("todolist", JSON.stringify(nextState));
        }
      }
    }
  },
  controller: {
    onMount() {
      todomvcService.then((data) => {
        this.setter.todolist(data);
      });
    },
    onCompleteTodo(index, checked) {
      this.state.todolist[index].check = checked;
      this.setter.todolist(this.state.todolist);
    },
    onAddTodo(text) {
      this.state.todolist.push({
        text,
        check: false
      });
      this.setter.todolist(this.state.todolist);
    },
    onDeletTodo(index) {
      this.setter.todolist(
        this.state.todolist.filter((v, i) => {
          return i !== index;
        })
      );
    }
  }
});

export default createComponent({
  name: "todolist",
  subscribe: {
    "todomvc-model": {
      state: {
        todolist({ nextState }) {
          this.setter.todolist(nextState);
        }
      }
    }
  },
  state: {
    todolist: todomvcModel.state.todolist,
    newTodoValue: ""
  },
  controller: {
    onChange(e, index) {
      todomvcModel.controller.onCompleteTodo(index, e.target.checked);
    },
    onNewTodoChange(e) {
      this.setter.newTodoValue(e.target.value);
    },
    onDeleteClick(index) {
      todomvcModel.controller.onDeletTodo(index);
    },
    onClick() {
      todomvcModel.controller.onAddTodo(this.state.newTodoValue);
      this.setter.newTodoValue("");
    }
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
              );
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
      );
    }
  }
});

```

在线示例: <https://codesandbox.io/s/romantic-yalow-9ewds?file=/src/Complex.js:0-2383>

> 更多详细的文档待更新...
