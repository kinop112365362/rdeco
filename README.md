# Rdeco

## Rdeco 是什么?

Rdeco 是什么? Rdeoc 是一个基于 Rx.js 的前端应用研发框架, 用于开发从简单组件到复杂大型应用的全流程框架

## Rdeco 包含哪些模块

Rdeco 包含以下模块用于前端应用研发的不同场景和需求

1. @rdeco/router5 一个基于 router5 的路由系统, 用于开发 spa 应用下的路由

2. @rdeco/core 基于 Rx.js 的核心库, 提供了开发响应式模块的核心功能

3. @rdeco/react 用于快速开发 react 组件, Rdeco 的架构并不和任何 UI 库绑定, 后续我们会开发和其他 UI库集成的包

## 快速开始

### 安装

```js
yarn add rdeco
```

> rdeco 内部模块目前没有拆包, 都统一从 rdeco 导出

### 用一个 todomvc 来说明 rdeco 如何快速开发一个 react 组件

```js
import React from 'react'
import { createComponent } from "rdeco";

export default createComponent({
  name: "todomvc",
  state: {
    todolist: [
      { text: "起床", check: false },
      { text: "吃饭", check: false },
      { text: "睡觉", check: false }
    ],
    newTodoValue: ""
  },
  controller: {
    onChange(e, index) {
      this.state.todolist[index].check = e.target.checked;
      this.setter.todolist(this.state.todolist);
    },
    onNewTodoChange(e) {
      this.setter.newTodoValue(e.target.value);
    },
    onDeleteClick(index) {
      this.setter.todolist(
        this.state.todolist.filter((v, i) => {
          return i !== index;
        })
      );
    },
    onClick() {
      this.state.todolist.push({
        check: false,
        text: this.state.newTodoValue
      });
      this.setter.todolist(this.state.todolist);
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

在线示例: <https://codesandbox.io/s/romantic-yalow-9ewds>
> 关于更多的文档内容待后续更新
