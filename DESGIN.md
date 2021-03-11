# 重构设计

React 重置 hook 获取到新的 state 和 dispatch 函数, 但是 dispatch 是稳定的, 意味着不需要修改引用来指向新的版本

storeConfig 在运行时是不变的, 这意味着唯一要解决的问题在于, state, rc 的创建过程是基于 dispatch 的, 但同时也需要新的 state, 从这个角度看, 一个全新的 14 版本应该基于这样设计

所有的函数上下文都在 构建阶段创建完毕, 函数类型包括 

- rc 下的 set 函数
- view 下的 render 函数
- controller 和 service 下的函数

hook 阶段同样分为 mount 和 update, mount 阶段, 除了调用 React hook, 同时会将 storeConfig 转换为 store, 为函数绑定各自的上下文,

然后进入 update 阶段, 这时候更新的 state, context 不会再触发高开销的 transfer 操作, 而仅仅是更新函数上下文中的 this.state 和 this.context

通过函数 reduce 来建立类似 redux 的 enhance 过程, 在 mount 阶段, 所有的函数都会被绑定上下文, 每一个 enhance 包裹完 store 后就交给下一个, enhance 的包裹过程中不绑定函数上下文, 函数上下文只属于 Membrane 和 Store, 这样设计就明确了 enhance 是一个非运行时干扰的模块, 确保运行时上下文的稳定性. 运行时处理是通过 hook 实现的, hook 会在运行时被激活, 但 hook 不属于 enhance, 因此不存在多个版本的 reduce 过程.Membrane 和 Store 定义 hook 会彼此覆盖.

enhance 可以用来解决各种外部插件的问题. 例如日志, 埋点等.或者是系统对接的工作.

combination 是多个 store 实例之间的链接, 通过创建一个中心化的内存对象可以将不同的 Store 实例进行联结