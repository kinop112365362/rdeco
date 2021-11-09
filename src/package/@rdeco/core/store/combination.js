import { ReplaySubject } from 'rxjs'
export const combination = {
  components: {},
  notificationSubjects: {},
  // eslint-disable-next-line no-undef
  observableList: new Set(),
  subjects: {
    deps: {},
    targets: {},
    targetsProxy: {},
  },
  enhanceContext: {},
  extends: {},
  $initTargetProxy(baseSymbol) {
    if (!this.subjects.targetsProxy[baseSymbol]) {
      this.subjects.targetsProxy[baseSymbol] = new ReplaySubject(Infinity)
    }
  },
  $setSubject(baseSymbol, store) {
    if (!this.subjects.targets[baseSymbol]) {
      this.subjects.targets[baseSymbol] = []
    }
    this.$initTargetProxy(baseSymbol)
    this.subjects.targets[baseSymbol].push(store)
    this.subjects.targetsProxy[baseSymbol].next(store)
  },
  $isObservable(baseSymbol) {
    return this.observableList.has(baseSymbol)
  },
  $metaHandle(meta) {
    return [meta]
  },
  $getCollection() {
    return this.components
  },
  $remove(symbol, baseSymbol) {
    const rawLenth = this.components[baseSymbol]
    console.debug(this.components, baseSymbol)
    this.components[baseSymbol] = this.components[baseSymbol].filter(
      (component) => {
        return component.instance.symbol !== symbol
      }
    )
    if (this.components[baseSymbol] >= rawLenth) {
      throw new Error(`${baseSymbol} 组件卸载异常`)
    }
  },
  $createNotificationSubject({ notification }, baseSymbol) {
    if (notification) {
      const notificationSubject = new ReplaySubject(9)
      if (!this.notificationSubjects[baseSymbol]) {
        this.notificationSubjects[baseSymbol] = notificationSubject
      }
    }
    return this.notificationSubjects[baseSymbol]
  },
  $createSubjects({ subscribe }, baseSymbol) {
    if (subscribe) {
      if (!this.subjects.deps[baseSymbol]) {
        // eslint-disable-next-line no-undef
        this.subjects.deps[baseSymbol] = new Set()
      }
      Object.keys(subscribe).forEach((observeTagetKey) => {
        this.subjects.deps[baseSymbol].add(observeTagetKey)
        this.observableList.add(observeTagetKey)
        this.$initTargetProxy(observeTagetKey)
      })
    }
    return null
  },
  $register(baseSymbol, instance) {
    if (!this.components[baseSymbol]) {
      this.components[baseSymbol] = []
    }
    this.components[baseSymbol].push({
      instance,
    })
  },
  $broadcast(componentStore, value, subjectKey) {
    if (this.$isObservable(componentStore.baseSymbol)) {
      value.targetMeta = {
        baseSymbol: componentStore.baseSymbol,
        props: componentStore.props,
      }
      componentStore.subjects[subjectKey].next(value)
    }
  },
}
export function readState(name, handle) {
  if (!combination.components[name]) {
    throw new Error(
      `${name} 组件不存在或者未实例化, 如果是异步渲染, 请通过事件监听来读取 state, readState 只支持同步读取`
    )
  }
  if (handle) {
    return combination.components[name].map((component) => {
      return handle({
        state: component.instance.state,
        props: component.instance.props,
      })
    })
  } else {
    return combination.components[name].map((component) => {
      return {
        state: component.instance.state,
        props: component.instance.props,
      }
    })
  }
}
export function enhanceContext(key, value) {
  combination.enhanceContext[key] = value
}
export function extendsSubscribe(key, handler) {
  if (combination.extends[key]) {
    throw new Error(`ExtendsError: ${key} 已经被扩展了, 不能再次扩展`)
  }
  combination.extends[key] = handler
}
if (window) {
  window.$$rdecoLog = () => {
    return {
      logger: Object.freeze({ ...combination }),
    }
  }
}
