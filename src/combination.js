import { connectSubject } from './subject'
import { BehaviorSubject, ReplaySubject } from 'rxjs'

/* eslint-disable no-undef */
export const combination = {
  subscribeIds: {},
  components: {},
  enhanceContext: {},
  proxySubjects: {},
  routerSubjects: {},
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
          } else {
            // throw new Error(`订阅异常: 组件集合中为找到 ${componentName} 组件`)
          }
        },
      })
    }
  },
  $set(symbol, ins) {
    const collection = this.$getCollection()
    collection[symbol] = ins
    if (!this.proxySubjects[symbol]) {
      this.proxySubjects[symbol] = new ReplaySubject(99)
    }
    if (ins.router && !this.routerSubjects[symbol]) {
      this.routerSubjects[symbol] = new BehaviorSubject(this.routerHistory[0])
    }
    connectSubject.next({
      name: symbol,
      componentInstance: ins,
    })
  },
  $routerBroadcast(...args) {
    const [subjectKey, arg, syncker] = args
    this.routerHistory.push({ subjectKey, arg, syncker })
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
