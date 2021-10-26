import { connectSubject } from '../subscribe/subject'
import { BehaviorSubject, ReplaySubject } from 'rxjs'

export const combination = {
  subscribeIds: {},
  components: {},
  enhanceContext: {},
  proxySubjects: {},
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
  $connectProxySubjectAsync(name, handle) {
    const collection = this.proxySubjects
    let componentName = name
    let findHandler = null
    if (Array.isArray(name)) {
      componentName = name[0]
      findHandler = name[1]
    }
    function connectAsyncCall(instance) {
      if (instance.shadow.length > 0) {
        if (findHandler) {
          const target = collection[componentName]?.shadow.find(
            (shadowProxy) => {
              return findHandler(shadowProxy.ins.props)
            }
          )
          return handle.call(null, target)
        }
        return instance.shadow.forEach((shadowTarget) => {
          handle.call(null, shadowTarget)
        })
      }
      handle.call(null, instance)
    }
    if (collection[componentName]) {
      connectAsyncCall(collection[componentName])
    } else {
      const connectSub = connectSubject.subscribe({
        next: ({ name, proxySubject }) => {
          if (name === componentName) {
            connectAsyncCall(proxySubject)
            connectSub?.unsubscribe()
          } else {
            // throw new Error(`订阅异常: 组件集合中为找到 ${componentName} 组件`)
          }
        },
      })
    }
  },
  $connectAsync(componentName, handle) {
    const collection = this.$getCollection(componentName)
    if (collection[componentName]) {
      handle.call(null, collection[componentName])
    } else {
      const connectSub = connectSubject.subscribe({
        next: ({ name, componentInstance }) => {
          if (name === componentName) {
            handle.call(null, componentInstance)
            connectSub?.unsubscribe()
          }
        },
      })
    }
  },
  $set(symbol, ins) {
    const collection = this.$getCollection()
    let proxySubject = {
      subject: new ReplaySubject(99),
      ins,
      shadow: [],
    }
    if (!collection[symbol]) {
      collection[symbol] = ins
      collection[symbol].shadow = []
    } else {
      collection[symbol].shadow.push(ins)
    }
    if (!this.proxySubjects[symbol]) {
      this.proxySubjects[symbol] = proxySubject
    } else {
      proxySubject = {
        subject: new ReplaySubject(99),
        ins,
      }
      this.proxySubjects[symbol].shadow.push(proxySubject)
    }
    if (!this.routerSubjects) {
      this.routerSubjects = new BehaviorSubject(this.routerHistory[0])
    }
    connectSubject.next({
      name: symbol,
      proxySubject,
      componentInstance: ins,
    })
    return proxySubject
  },
  $routerBroadcast(...args) {
    const [subjectKey, arg, next] = args
    this.routerHistory.push({ subjectKey, arg, next })
    if (this.routerSubjects) {
      this.routerSubjects.next({ subjectKey, arg, next })
    }
  },
  $broadcast(symbol, value, subjectKey) {
    const collection = this.$getCollection()
    collection[symbol].subjects[subjectKey].next(value)
  },
}
export function enhanceContext(key, value) {
  combination.enhanceContext[key] = value
}
if (window) {
  window.$$rdecoLog = () => {
    return {
      components: Object.freeze(combination.components),
      enhanceContext: Object.freeze(combination.enhanceContext),
    }
  }
}
