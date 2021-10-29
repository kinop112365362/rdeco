import { BehaviorSubject, ReplaySubject } from 'rxjs'

/* eslint-disable no-undef */
export const combination = {
  components: {},
  notificationSubjects: {},
  observableList: new Set(),
  subjects: {
    deps: {},
    target: {},
  },
  enhanceContext: {},
  extends: {},
  $isObservable(baseSymbol) {
    return this.observableList.has(baseSymbol)
  },
  $metaHandle(meta) {
    if (meta.includes('::')) {
      const metaInfo = meta.split('::')
      if (metaInfo.length !== 3) {
        throw new Error(
          `${metaInfo} 格式错误, 应包含对应的 propsKey 和 propsValue`
        )
      }
      return [metaInfo[0], metaInfo[1], metaInfo[2]]
    }
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
    const targets = this.subjects.target
    Object.keys(targets)
      .filter((targetKey) => {
        return new RegExp(`^${baseSymbol}`).test(targetKey)
      })
      .forEach((matchKey) => {
        if (Array.isArray(targets[matchKey])) {
          targets[matchKey] = targets[matchKey].filter((t) => {
            return t.symbol !== symbol
          })
        } else {
          if (targets[matchKey] && targets[matchKey].symbol === symbol) {
            targets[matchKey] = null
          }
        }
      })
  },
  $createNotificationSubject({ notification }, baseSymbol) {
    if (notification) {
      const notificationSubject = new ReplaySubject(99)
      if (!this.notificationSubjects[baseSymbol]) {
        this.notificationSubjects[baseSymbol] = notificationSubject
      }
    }
    return this.notificationSubjects[baseSymbol]
  },
  $createSubjects({ subscribe }, baseSymbol, symbol, props = {}) {
    if (subscribe) {
      if (!this.subjects.deps[baseSymbol]) {
        this.subjects.deps[baseSymbol] = new Set()
      }
      Object.keys(subscribe).forEach((observeTagetKey) => {
        const subjects = {
          state: new BehaviorSubject(null),
          controller: new BehaviorSubject(null),
          service: new BehaviorSubject(null),
          tappable: new BehaviorSubject(null),
          eventKey: observeTagetKey,
          symbol,
        }
        const [name, propsKey, propsValue] = this.$metaHandle(observeTagetKey)
        this.subjects.deps[baseSymbol].add(observeTagetKey)
        this.observableList.add(name)
        if (propsKey) {
          if (props[propsKey] === propsValue) {
            if (!this.subjects.target[observeTagetKey]) {
              this.subjects.target[observeTagetKey] = []
            }
            this.subjects.target[observeTagetKey].push(subjects)
          }
        } else {
          if (!this.subjects.target[name]) {
            this.subjects.target[name] = subjects
          }
        }
      })
    }
    return null
  },
  $register(symbol, instance) {
    if (!this.components[symbol]) {
      this.components[symbol] = []
    }
    this.components[symbol].push({
      instance,
    })
  },
  $broadcast(componentStore, value, subjectKey) {
    if (this.$isObservable(componentStore.baseSymbol)) {
      value.targetMeta = {
        baseSymbol: componentStore.baseSymbol,
        props: componentStore.props,
      }
      const targets = this.subjects.target
      Object.keys(targets)
        .filter((targetKey) => {
          return new RegExp(`^${componentStore.baseSymbol}`).test(targetKey)
        })
        .forEach((matchKey) => {
          if (Array.isArray(targets[matchKey])) {
            targets[matchKey].forEach((targetSubject) => {
              targetSubject[subjectKey].next(value)
            })
          } else {
            targets[matchKey][subjectKey].next(value)
          }
        })
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
      components: Object.freeze({ ...combination }),
    }
  }
}
