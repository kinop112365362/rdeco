import { BehaviorSubject, ReplaySubject } from 'rxjs'

let combination = {
  loader: (n) => n,
  modules: {},
  components: {},
  pluginSubject: new ReplaySubject(9999),
  notificationSubjects: {},
  registerSubject: new BehaviorSubject(null),
  // eslint-disable-next-line no-undef
  observableList: new Set(),
  subjects: {
    deps: {},
    targets: {},
    targetsProxy: {},
    targetsPropxyQueue: {},
  },
  enhanceContext: {},
  extends: {},
  // eslint-disable-next-line no-undef
  namelist: new Set(),
  $record(data) {
    if (data.targetMeta.baseSymbol !== 'rdeco-dev-tools') {
      this.pluginSubject.next(data)
    }
  },
  $initTargetProxy(baseSymbol) {
    if (!this.subjects.targetsProxy[baseSymbol]) {
      this.subjects.targetsProxy[baseSymbol] = new BehaviorSubject(null)
      this.subjects.targetsPropxyQueue[baseSymbol] = []
    }
  },
  $setSubject(baseSymbol, store) {
    if (!this.subjects.targets[baseSymbol]) {
      this.subjects.targets[baseSymbol] = []
    }
    this.$initTargetProxy(baseSymbol)
    this.subjects.targets[baseSymbol].push(store)
    this.subjects.targetsPropxyQueue[baseSymbol].push(store)
    this.subjects.targetsProxy[baseSymbol].next(
      this.subjects.targetsPropxyQueue[baseSymbol]
    )
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
    if (this.notificationSubjects[baseSymbol]) {
      if (this.notificationSubjects[baseSymbol]._events) {
        this.notificationSubjects[baseSymbol]._events.length = 0
      }
      if (this.notificationSubjects[baseSymbol]._buffer) {
        this.notificationSubjects[baseSymbol]._buffer.length = 0
      }
    }
    const rawLenth = this.components[baseSymbol]
    this.components[baseSymbol] = this.components[baseSymbol].filter(
      (component) => {
        if (component.symbol) {
          return component.symbol !== symbol
        }
        return component.instance.symbol !== symbol
      }
    )
    if (this.components[baseSymbol].length > rawLenth) {
      throw new Error(`${baseSymbol} 组件卸载异常`)
    }
    const rawTargetsLenth = this.subjects.targets[baseSymbol]
    this.subjects.targets[baseSymbol] = this.subjects.targets[
      baseSymbol
    ].filter((target) => {
      return target.symbol !== symbol
    })
    if (this.subjects.targets[baseSymbol].length > rawTargetsLenth) {
      throw new Error(`${baseSymbol} 组件监听器卸载异常`)
    }
    const rawTargetsQueueLenth = this.subjects.targetsPropxyQueue[baseSymbol]
    this.subjects.targetsPropxyQueue[baseSymbol] =
      this.subjects.targetsPropxyQueue[baseSymbol].filter((target) => {
        return target.symbol !== symbol
      })
    if (
      this.subjects.targetsPropxyQueue[baseSymbol].length > rawTargetsQueueLenth
    ) {
      throw new Error(`${baseSymbol} 组件监听器卸载异常`)
    }
    if (this.subjects.targetsPropxyQueue[baseSymbol].length === 0) {
      this.subjects.targetsProxy[baseSymbol].next(null)
    }
  },
  $createNotificationSubject({ exports }, baseSymbol) {
    if (exports) {
      const notificationSubject = new ReplaySubject()
      if (!this.notificationSubjects[baseSymbol]) {
        this.notificationSubjects[baseSymbol] = notificationSubject
      }
    }
    return this.notificationSubjects[baseSymbol]
  },
  $createSubjects({ subscriber }, baseSymbol) {
    if (baseSymbol === undefined) {
      throw new Error('baseSymbol is undefined!!')
    }
    if (subscriber) {
      if (!this.subjects.deps[baseSymbol]) {
        // eslint-disable-next-line no-undef
        this.subjects.deps[baseSymbol] = new Set()
      }
      Object.keys(subscriber).forEach((observeTagetKey) => {
        this.subjects.deps[baseSymbol].add(observeTagetKey)
        this.observableList.add(observeTagetKey)
        this.$initTargetProxy(observeTagetKey)
      })
    }
    return null
  },
  $register(baseSymbol, instance, isSingle = false) {
    if (isSingle) {
      if (!this.components[baseSymbol]) {
        this.components[baseSymbol] = [{ instance }]
        this.namelist.add(baseSymbol)
      }
    } else {
      if (!this.components[baseSymbol]) {
        this.components[baseSymbol] = []
        this.namelist.add(baseSymbol)
      }
      this.components[baseSymbol].push({
        instance,
      })
      this.registerSubject.next({
        baseSymbol,
        instance,
      })
    }
  },
  $broadcast(componentStore, value, subjectKey) {
    /**
     * TODO: 插件的编写主要在于监听这些代码的执行过程，以 @rdeco/logger 为例
     * 编写一个插件，可以通过这个 ReplaySubject 获取所有响应式对象的执行过程中产生的数据
     * logger 包就只是 subscribe 了这个 ReplaySubject 的数据。出于性能考虑，可以将插件的
     * 执行放在一个 webWorker 里。
     */

    value.targetMeta = {
      baseSymbol: componentStore.baseSymbol,
      props: componentStore.props,
    }
    componentStore.subjects[subjectKey].next(value)
    this.$record(value)
  },
}
export function addPlugin(subscirbeCall) {
  return combination.pluginSubject.subscribe(subscirbeCall)
}
export function registerModule(key, value) {
  if (combination.modules[key]) {
    console.error(`你覆盖了${key} module, 请确保这不是个意外`)
  }
  combination.modules[key] = value
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

export const namelist = combination.namelist
export function configModuleLoader(loader) {
  if (!combination.loader) {
    combination.loader = loader
  } else {
    console.error(
      `loader 已经被注入了，再次注入 loader 不会生效，如果是组件集成，请检查注入 loader 的代码`
    )
  }
}
export function enhanceContext(key, value) {
  if (!combination.enhanceContext[key]) {
    combination.enhanceContext[key] = value
  } else {
    console.error(
      `Context ${key} 已经被注入了，再次注入同名的 Context 不会生效，如果是组件集成，请检查彼此的 Context 是否重名`
    )
  }
}
export function extendsSubscribe(key, handler) {
  if (!combination.extends[key]) {
    combination.extends[key] = handler
  }
}
if (window) {
  if (window.$$rdeco_combination) {
    combination = window.$$rdeco_combination
  } else {
    window.$$rdeco_combination = combination
  }
  window.$$rdecoLog = () => {
    return {
      logger: Object.freeze({ ...combination }),
    }
  }
}

export { combination }
