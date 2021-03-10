---
id: service
title: Service
sidebar_label: Service
slug: /service
---

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