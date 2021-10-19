import { connectSubject } from './subject'
import createName from './utils/create-name'
import { BehaviorSubject } from 'rxjs'

/* eslint-disable no-undef */
export const combination = {
  names: new Set(),
  subscribeNames: {},
  entites: {},
  components: {},
  enhanceContext: {},
  proxySubjects: {},
  $remove(componentName) {
    if (this.components[componentName]) {
      this.components[componentName] = null
    }
  },
  $connectAsync(componentName, handle) {
    if (this.components[componentName]) {
      handle.call(null, this.components[componentName])
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
  $has({ name, sid }) {
    const componentName = createName({ name, sid })
    if (this.components[componentName]) {
      return true
    }
    return false
  },
  $set(storeConfig, ins) {
    this.components[ins.name] = ins
    if (!this.proxySubjects[ins.name]) {
      this.proxySubjects[ins.name] = new BehaviorSubject(null)
    }
    connectSubject.next({
      name: ins.name,
      componentInstance: ins,
    })
    this.names.add(ins.name)
  },
  $broadcast(name, value, subjectKey) {
    if (name.includes('_')) {
      name = name.split('_')[0] + ':sid'
    }
    this.subscribeNames[name]?.forEach((targetName) => {
      this.$connectAsync(targetName, (target) => {
        target.subjects[`${subjectKey}Subject`].next(value)
      })
    })
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
