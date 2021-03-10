---
id: controller
title: Controller
sidebar_label: Controller
slug: /controller
---

Controller 相比 Service 更严格, 命名上有语义化限制, 必须以 on[名词][动词] 来进行命名 

我们建议使用 on + 元素名 + [Click/Change/Mount...] 等方式来命名 Controller

实际运行中, 除了 on 开头其余并不做校验, 因此你可以自己定义一套命名规则, 确保团队基于这个规则能够有理解上的共识

Controller 和 Service 内部都可以拿到 this.rc 操作 initState 来更新 View