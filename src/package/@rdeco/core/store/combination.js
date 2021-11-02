import { BehaviorSubject, ReplaySubject } from 'rxjs'

export const combination = {
  components: {},
  notificationSubjects: {},
  // eslint-disable-next-line no-undef
  observableList: new Set(),
  subjects: {
    deps: {},
    targets: {},
  },
  enhanceContext: {},
  connectTargetSubject: new ReplaySubject(20),
  extends: {},
  $connectTargetSubject(targetKey, handle) {
    return this.connectTargetSubject.subscribe({
      next: (value) => {
        if (value.targetKey === targetKey) {
          handle(this.subjects.targets[targetKey])
        }
      },
    })
  },
  $setSubject(baseSymbol, subject) {
    if (!this.subjects.targets[baseSymbol]) {
      this.subjects.targets[baseSymbol] = []
    }
    this.subjects.targets[baseSymbol].push(subject)
    this.connectTargetSubject.next({
      targetKey: baseSymbol,
    })
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
    this.components[baseSymbol] = this.components[baseSymbol].filter(
      (component) => {
        return component.instance.symbol !== symbol
      }
    )
  },
  $createNotificationSubject({ notification }, baseSymbol) {
    if (notification) {
      const notificationSubject = new BehaviorSubject(null)
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
