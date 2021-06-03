# Structured-React-Hook

用对象重新定义 React 组件

先来安装下
```js
yarn add structured-react-hook

```

这是一个基本示例, 声明状态, 通过控制器修改状态触发渲染

```js
import { createComponent } from 'structured-react-hook'

const Button = createComponent({
  name:'Button',
  initState:{
    text:'按钮'
  },
  controller:{
    onClick(){
      this.rc.setState({
        text:'你点击了按钮'
      })
    }
  },
  view:{
    render(){
      return(){
        <button onClick={this.controller.onClick}>{this.state.text}</button>
      }
    }
  }
})
```

So Easy!!

更详细的文档见库官网 https://kinop112365362.github.io/structured-react-hook/
