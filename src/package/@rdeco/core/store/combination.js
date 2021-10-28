import { connectSubject } from '../subscribe/subject'
import { ReplaySubject } from 'rxjs'

export const combination = {
  subscribeIds: {},
  components: {},
  enhanceContext: {},
  proxySubjects: {},
  extends: {},
  routerSubjects: null,
  routerHistory: [],
  $getCollection() {
    return this.components
  },
  $remove(symbol) {
    const collection = this.$getCollection(symbol)
    if (collection[symbol]) {
      collection[symbol] = null
    }
  },
  $connect(meta, handle, observeStore = null) {
    let name = meta
    let finder = null
    if (Array.isArray(meta)) {
      name = meta[0]
      finder = meta[1]
    }
    const peformCount = 20
    const invoke = () => {
      let targets = this.components[name]
      if (finder) {
        targets = this.components[name].filter((component) => {
          if (observeStore) {
            const context = {
              state: { ...observeStore.state },
              props: { ...observeStore.props },
            }
            return finder(component.instance.props, context)
          }
          return finder(component.instance.props)
        })
        if (!targets) {
          throw new Error(
            `查找 ${name} 组件下的某个实例失败, 请检查 finder 函数里是否 return, 或者匹配规则是否正确`
          )
        }
      }
      if (targets.length > peformCount) {
        console.error(
          `触发的监听器数量较都, 可能产生性能问题, 请尽可能精确监听, 避免批量监听 监听器: ${name}`
        )
      }
      targets.forEach((target) => {
        handle.call(null, target)
      })
    }
    if (this.components[name]) {
      invoke()
    } else {
      connectSubject.subscribe({
        next: (connectName) => {
          if (connectName === name) {
            invoke()
          }
        },
      })
    }
  },
  $register(symbol, instance) {
    const notificationSubject = new ReplaySubject(99)
    if (!this.components[symbol]) {
      this.components[symbol] = []
    }
    this.components[symbol].push({
      instance,
      notificationSubject,
    })
    connectSubject.next(symbol)
    return notificationSubject
  },
  $broadcast(symbol, value, subjectKey) {
    this.components[symbol].forEach((component) => {
      component.instance.subjects[subjectKey].next(value)
    })
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
      components: Object.freeze({ ...combination }),
    }
  }
}
