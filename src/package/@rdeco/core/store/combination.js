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
  $connectProxySubjectAsync(name, handle) {
    const collection = this.proxySubjects
    let componentName = name
    let findHandler = null
    if (Array.isArray(name)) {
      componentName = name[0]
      findHandler = name[1]
    }
    function connectAsyncCall(instance) {
      if (findHandler) {
        const target = collection[componentName]?.shadow.find((shadowProxy) => {
          return findHandler(shadowProxy.ins.props)
        })
        return handle.call(null, target)
      }
      return instance.shadow.forEach((shadowTarget) => {
        handle.call(null, shadowTarget)
      })
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
            connectAsyncCall(proxySubject)
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
      collection[symbol].shadow.push(ins)
    } else {
      collection[symbol].shadow.push(ins)
    }
    if (!this.proxySubjects[symbol]) {
      this.proxySubjects[symbol] = proxySubject
      this.proxySubjects[symbol].shadow.push(proxySubject)
    } else {
      proxySubject = {
        subject: new ReplaySubject(99),
        ins,
      }
      this.proxySubjects[symbol].shadow.push(proxySubject)
    }
    connectSubject.next({
      name: symbol,
      proxySubject,
      componentInstance: ins,
    })
    return proxySubject
  },
  $broadcast(symbol, value, subjectKey) {
    const collection = this.$getCollection()
    collection[symbol].subjects[subjectKey].next(value)
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
      components: Object.freeze(combination.components),
      enhanceContext: Object.freeze(combination.enhanceContext),
    }
  }
}
