---
id: membrane
title: Membrane
sidebar_label: Membrane
slug: /membrane
---

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