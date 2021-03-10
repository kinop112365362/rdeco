---
id: combination
title: Combination
sidebar_label: Combination
slug: /combination
---

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
    },
    view:{
        render(){
            return(
                <div>{this.state.name}</div>
            )
        }
    }
}
const mainStoreConfig = {
    initState:{},
    controller:{
        onButtonClick(){
            this.combination['sub'].controller.onNameChange('ann')
        }
    },
    view:{
        render(
            return(
                <div>{this.combination['sub'].view.render()}</div>
            )
        )
    }
}

所有 Store 都可以拥有自己的 name, 但大多数情况下我们并不需要刻意的命名, 使用匿名 Store 更加方便, 只有当你需要将 Controller 暴露给其他 Store 的时候, 你可以使用具名 Store

> 特别注意的是, 目前具名 Store 不支持多实例化, 这样是为了避免 combination 设计上的复杂性, 匿名 Store 不具有被联结的能力, 因此可以多实例化.
```