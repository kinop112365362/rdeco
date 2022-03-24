# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.11.2](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.11.1...@rdeco/core@3.11.2) (2022-03-24)


### Bug Fixes

* **task:** task 相关的一些 bug ([550b0cb](https://github.com/kinop112365362/rdeco/commit/550b0cbf0ac02f91d51aca0b28cbff986f045117))





## [3.11.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.11.0...@rdeco/core@3.11.1) (2022-03-23)


### Bug Fixes

* **core:** pending 在有参数的情况下没有传入 ([7aaaa9e](https://github.com/kinop112365362/rdeco/commit/7aaaa9ed7317264b48705a850f5e3c9c242ea674))





# [3.11.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.10.0...@rdeco/core@3.11.0) (2022-03-22)


### Features

* **core:** 增加 mock 方法用于处理测试中对 inject 模块的方法模拟 ([6de1246](https://github.com/kinop112365362/rdeco/commit/6de1246c57ef06939738fa70f96a92334adad8fc))





# [3.10.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.9.0...@rdeco/core@3.10.0) (2022-03-18)


### Features

* **store:** setter 增加 callback 用于 state 变更后执行相关逻辑 ([a36e112](https://github.com/kinop112365362/rdeco/commit/a36e112a956d98521b10154674184cb6c98dd729))





# [3.9.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.8.1...@rdeco/core@3.9.0) (2022-03-18)


### Features

* **req:** 增加了 pending 状态用于解决 Promise 只有 resolve 和 reject 的问题 ([1ca0972](https://github.com/kinop112365362/rdeco/commit/1ca09720a8c0df9c7615fcfd12b8ee19cf00f344))





## [3.8.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.8.0...@rdeco/core@3.8.1) (2022-03-07)

**Note:** Version bump only for package @rdeco/core





# [3.8.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.7.1...@rdeco/core@3.8.0) (2022-03-04)


### Features

* **version:** add version for window look ([52e70dd](https://github.com/kinop112365362/rdeco/commit/52e70dd024e9c1dea3c0ba7e30944ee98b55e814))





## [3.7.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.7.0...@rdeco/core@3.7.1) (2022-03-03)


### Bug Fixes

* **store:** prevState 如果是对象不会保持的问题 ([30338a0](https://github.com/kinop112365362/rdeco/commit/30338a094c5ece0a76742407ee88c0a9f4ad1d02))





# [3.7.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.7...@rdeco/core@3.7.0) (2022-03-02)


### Features

* **subscribe:**  添加了 self 用于监听自身 ([f293da1](https://github.com/kinop112365362/rdeco/commit/f293da1012ab4824d9ab400b768bcff461253c81))





## [3.6.7](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.6...@rdeco/core@3.6.7) (2022-02-17)


### Bug Fixes

* **proxy:** 没有设置 baseSymbol ([c07a96b](https://github.com/kinop112365362/rdeco/commit/c07a96bfd5c99bd9fde7cbd65fb0cbb77b17ad46))





## [3.6.6](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.5...@rdeco/core@3.6.6) (2022-02-17)


### Bug Fixes

* **prxoy:** 组件实例删除后，targetProxy 需要置空为 null ([8f0f301](https://github.com/kinop112365362/rdeco/commit/8f0f301e6bd8a4ee79061308d441a4ff848f86e9))





## [3.6.5](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.4...@rdeco/core@3.6.5) (2022-02-17)


### Bug Fixes

* **store:** create 从源头拷贝一份 storeConfig ([e61936a](https://github.com/kinop112365362/rdeco/commit/e61936a140b8c254b26f3ba78a406012c0e8d3a1))





## [3.6.4](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.3...@rdeco/core@3.6.4) (2022-02-16)


### Bug Fixes

* **store:** 重新创建的组件的 state 没有被重置 ([2fb29b9](https://github.com/kinop112365362/rdeco/commit/2fb29b9cb0f83332c6627b35024ddab9186d7801))
* **store:** 重新创建的组件的 state 没有被重置 ([7c11b70](https://github.com/kinop112365362/rdeco/commit/7c11b701c2bfd41dc57d05e8b559e07be2e01908))





## [3.6.3](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.2...@rdeco/core@3.6.3) (2022-02-15)


### Bug Fixes

* **create:** baseSymbol → symbol ([10340e3](https://github.com/kinop112365362/rdeco/commit/10340e37e572aadcf96b69f7ed6b05221b335f94))





## [3.6.2](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.1...@rdeco/core@3.6.2) (2022-02-15)


### Bug Fixes

* **create:** 默认 store 是单例不存在多实例 ([6a9fcf9](https://github.com/kinop112365362/rdeco/commit/6a9fcf9067d84e41c758649224afb150700e3e5f))
* **create:** 默认 store 是单例不存在多实例 ([4ec968c](https://github.com/kinop112365362/rdeco/commit/4ec968ce6fad08f4a3336af895b57308b6a6703a))





## [3.6.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.6.0...@rdeco/core@3.6.1) (2022-02-14)


### Bug Fixes

* **exports:** error 需要显示调用 ([dad4ea3](https://github.com/kinop112365362/rdeco/commit/dad4ea353cb2922e0b35970440ff6df1d59784ec))





# [3.6.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.5.2...@rdeco/core@3.6.0) (2022-02-14)


### Features

* **inject:** 添加对 error 的处理 ([9418144](https://github.com/kinop112365362/rdeco/commit/94181444bdf1159e77aadff3ca2f909ab1179d2b))





## [3.5.2](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.5.1...@rdeco/core@3.5.2) (2022-01-24)


### Bug Fixes

* **remove:** 兼容某个旧版本的语法 ([9f8642d](https://github.com/kinop112365362/rdeco/commit/9f8642d0322546c1d03758e8cc346149133d777b))





## [3.5.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.5.0...@rdeco/core@3.5.1) (2022-01-19)


### Bug Fixes

* **rdt:** 部分记录重复 ([7079e66](https://github.com/kinop112365362/rdeco/commit/7079e663f053652ad6234768bbec75144475feac))





# [3.5.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.4.6...@rdeco/core@3.5.0) (2022-01-19)


### Features

* **rdt:** 增加对 subscribe 执行的记录 ([d25eb1d](https://github.com/kinop112365362/rdeco/commit/d25eb1d10efdd3439de018f83f2606c0a1b97d1a))





## [3.4.6](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.4.5...@rdeco/core@3.4.6) (2022-01-17)


### Bug Fixes

* **register:** 默认多实例， create 特殊 ([ac03ace](https://github.com/kinop112365362/rdeco/commit/ac03ace72dad642023c4abc6bd612dffa3995de3))





## [3.4.5](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.4.4...@rdeco/core@3.4.5) (2022-01-13)

**Note:** Version bump only for package @rdeco/core





## [3.4.4](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.4.2...@rdeco/core@3.4.4) (2022-01-12)

**Note:** Version bump only for package @rdeco/core





## [3.4.2](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.4.0...@rdeco/core@3.4.2) (2022-01-12)


### Bug Fixes

* **core:** 传递 value 的判断逻辑异常 ([559caf6](https://github.com/kinop112365362/rdeco/commit/559caf689c893e1fa4e26ef32bd5262c67701721))





# [3.4.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.3.5...@rdeco/core@3.4.0) (2022-01-11)


### Features

* **core:** combination.$register add isSingle 用于支持非多实例场景，create 默认为单例 ([3a286d6](https://github.com/kinop112365362/rdeco/commit/3a286d690e8144017c9bd6865f0689a42b6a4ffd))





## [3.3.5](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.3.3...@rdeco/core@3.3.5) (2022-01-10)

**Note:** Version bump only for package @rdeco/core





## [3.3.4](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.3.1...@rdeco/core@3.3.4) (2022-01-10)


### Bug Fixes

* **core:** 避免多个 rdeco 加载时可能产生的冲突 ([46af5f4](https://github.com/kinop112365362/rdeco/commit/46af5f474c04133c357aa331a412b03a07493d7d))





## [3.3.3](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.3.1...@rdeco/core@3.3.3) (2022-01-07)


### Bug Fixes

* **core:** 避免多个 rdeco 加载时可能产生的冲突 ([46af5f4](https://github.com/kinop112365362/rdeco/commit/46af5f474c04133c357aa331a412b03a07493d7d))





## [3.3.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.10...@rdeco/core@3.3.1) (2022-01-07)

**Note:** Version bump only for package @rdeco/core





# [3.3.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.0.1...@rdeco/core@3.3.0) (2022-01-05)


### Bug Fixes

* **invoke:** some error ([14999e6](https://github.com/kinop112365362/rdeco/commit/14999e62e7b8c95817ebee337fe5de2d06c2fde3))
* **path:** 路径依赖错误 ([8e42a6a](https://github.com/kinop112365362/rdeco/commit/8e42a6ab5920993fd826d09e9a1ae39dd1a9687a))
* **plugin:** controller  和 service 执行的时候没有 source ([45b8919](https://github.com/kinop112365362/rdeco/commit/45b8919eb5132f3ae149d98e06a7dfa56b133feb))
* **plugin:** no baseSymbol ([2aa27f5](https://github.com/kinop112365362/rdeco/commit/2aa27f547265f15bc27ec41680f076922b4fb056))
* **plugin:** no eventTargetMeta ([0ad87be](https://github.com/kinop112365362/rdeco/commit/0ad87bed25ef2881b7672485c3efbb2635fbdb50))
* **plugin:** 修改触发的逻辑 ([71fae38](https://github.com/kinop112365362/rdeco/commit/71fae3854ec74ad439fa83cb455d44738a7515e5))
* **plugin:** 重复添加 setter 日志 ([9894f10](https://github.com/kinop112365362/rdeco/commit/9894f10e4be6c8c8e484f716b4fd5276ceeae2c7))
* **subscribe:** value.data may be null ([60f5111](https://github.com/kinop112365362/rdeco/commit/60f5111df86d212e10e0a1dde2b461463bc0262b))
* **subscribe:** 处理 value.data 的兼容性 ([f5b5b8b](https://github.com/kinop112365362/rdeco/commit/f5b5b8bdc6d13312b71c19fea65d94544dc0da57))
* **subscribe:** 处理 value.data 的边界情况 ([2b0da37](https://github.com/kinop112365362/rdeco/commit/2b0da37a0d0ed21246adcf6848fb361b6f3eb630))


### Features

* **invoke:**  添加对 invoke 执行的日志监控 ([5a55e5d](https://github.com/kinop112365362/rdeco/commit/5a55e5defc396b44d642fcc5a1c9c38ccca52806))
* **plugin:** 添加 addPlugin 代替直接操作 combination ([d19d017](https://github.com/kinop112365362/rdeco/commit/d19d01742c18bf280b3b5137ff09b8ec74009bc6))





## [3.2.10](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.8...@rdeco/core@3.2.10) (2022-01-04)

**Note:** Version bump only for package @rdeco/core





## [3.2.8](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.7...@rdeco/core@3.2.8) (2021-12-31)


### Bug Fixes

* **subscribe:** 处理 value.data 的边界情况 ([2b0da37](https://github.com/kinop112365362/rdeco/commit/2b0da37a0d0ed21246adcf6848fb361b6f3eb630))
* **subscribe:** 处理 value.data 的兼容性 ([f5b5b8b](https://github.com/kinop112365362/rdeco/commit/f5b5b8bdc6d13312b71c19fea65d94544dc0da57))





## [3.2.7](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.6...@rdeco/core@3.2.7) (2021-12-31)


### Bug Fixes

* **subscribe:** value.data may be null ([60f5111](https://github.com/kinop112365362/rdeco/commit/60f5111df86d212e10e0a1dde2b461463bc0262b))





## [3.2.6](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.5...@rdeco/core@3.2.6) (2021-12-31)


### Bug Fixes

* **plugin:** controller  和 service 执行的时候没有 source ([45b8919](https://github.com/kinop112365362/rdeco/commit/45b8919eb5132f3ae149d98e06a7dfa56b133feb))





## [3.2.5](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.4...@rdeco/core@3.2.5) (2021-12-30)


### Bug Fixes

* **plugin:** 重复添加 setter 日志 ([9894f10](https://github.com/kinop112365362/rdeco/commit/9894f10e4be6c8c8e484f716b4fd5276ceeae2c7))





## [3.2.4](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.3...@rdeco/core@3.2.4) (2021-12-30)


### Bug Fixes

* **plugin:** 修改触发的逻辑 ([71fae38](https://github.com/kinop112365362/rdeco/commit/71fae3854ec74ad439fa83cb455d44738a7515e5))





## [3.2.3](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.2...@rdeco/core@3.2.3) (2021-12-30)


### Bug Fixes

* **plugin:** no eventTargetMeta ([0ad87be](https://github.com/kinop112365362/rdeco/commit/0ad87bed25ef2881b7672485c3efbb2635fbdb50))





## [3.2.2](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.1...@rdeco/core@3.2.2) (2021-12-30)


### Bug Fixes

* **plugin:** no baseSymbol ([2aa27f5](https://github.com/kinop112365362/rdeco/commit/2aa27f547265f15bc27ec41680f076922b4fb056))





## [3.2.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.2.0...@rdeco/core@3.2.1) (2021-12-30)

**Note:** Version bump only for package @rdeco/core





# [3.2.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.1.3...@rdeco/core@3.2.0) (2021-12-30)


### Features

* **plugin:** 添加 addPlugin 代替直接操作 combination ([d19d017](https://github.com/kinop112365362/rdeco/commit/d19d01742c18bf280b3b5137ff09b8ec74009bc6))





## [3.1.3](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.1.2...@rdeco/core@3.1.3) (2021-12-30)


### Bug Fixes

* **path:** 路径依赖错误 ([8e42a6a](https://github.com/kinop112365362/rdeco/commit/8e42a6ab5920993fd826d09e9a1ae39dd1a9687a))





## [3.1.2](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.1.1...@rdeco/core@3.1.2) (2021-12-30)

**Note:** Version bump only for package @rdeco/core





## [3.1.1](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.1.0...@rdeco/core@3.1.1) (2021-12-29)

**Note:** Version bump only for package @rdeco/core





# [3.1.0](https://github.com/kinop112365362/rdeco/compare/@rdeco/core@3.0.0...@rdeco/core@3.1.0) (2021-12-29)


### Bug Fixes

* **invoke:** some error ([14999e6](https://github.com/kinop112365362/rdeco/commit/14999e62e7b8c95817ebee337fe5de2d06c2fde3))


### Features

* **invoke:**  添加对 invoke 执行的日志监控 ([5a55e5d](https://github.com/kinop112365362/rdeco/commit/5a55e5defc396b44d642fcc5a1c9c38ccca52806))
