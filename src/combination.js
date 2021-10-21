import { connectSubject } from './subject'
import createName from './utils/createName'
import { BehaviorSubject, ReplaySubject } from 'rxjs'

/* eslint-disable no-undef */
export const combination = {
  names: new Set(),
  subscribeNames: {},
  entites: {},
  components: {},
  enhanceContext: {},
  proxySubjects: {},
  routerSubjects: {},
  routerHistory: [],
  $getCollection(name) {
    if (/Entity$/.test(name)) {
      return this.entites
    }
    return this.components
  },
  $remove(componentName) {
    const collection = this.$getCollection(componentName)
    if (collection[componentName]) {
      collection[componentName] = null
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
  $has({ name, sid }) {
    const componentName = createName({ name, sid })
    const collection = this.$getCollection(componentName)
    if (collection[componentName]) {
      return true
    }
    return false
  },
  $set(storeConfig, ins, type = 'components') {
    this[type][ins.name] = ins
    if (!this.proxySubjects[ins.name]) {
      this.proxySubjects[ins.name] = new ReplaySubject(99)
    }
    if (storeConfig.router && !this.routerSubjects[ins.name]) {
      this.routerSubjects[ins.name] = new BehaviorSubject(this.routerHistory[0])
    }
    connectSubject.next({
      name: ins.name,
      componentInstance: ins,
      type,
    })
    this.names.add(ins.name)
  },
  $routerBroadcast(...args) {
    const [subjectKey, arg, syncker] = args
    this.routerHistory.push({ subjectKey, arg, syncker })
  },
  $broadcast(name, value, subjectKey) {
    const collection = this.$getCollection(name)
    collection[name].subjects[subjectKey].next(value)
  },
  $getSidNames(sidName) {
    const names = Array.from(this.names)
    return names.filter((name) => {
      name.split('_')[0] === sidName
    })
  },
}
export function enhanceContext(key, value) {
  combination.enhanceContext[key] = value
}
if (window) {
  window.$$rdecoLog = () => {
    return {
      names: Object.freeze(combination.names),
      entites: Object.freeze(combination.entites),
      components: Object.freeze(combination.components),
      enhanceContext: Object.freeze(combination.enhanceContext),
    }
  }
}
