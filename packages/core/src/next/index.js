/* eslint-disable no-undef */
import { BehaviorSubject, AsyncSubject } from 'rxjs'

const manager = {
  subjects: {},
  subjectsBeCallInfoQueue: {},
  mock: {},
  removeSubject(name, symbol) {
    this.subjects[name] = this.subjects[name].filter(
      (subject) => subject.symbol !== symbol
    )
  },
}

function callMethod(target, method, args, resolve, reject) {
  if (manager.subjects[target]) {
    manager.subjects[target].forEach((targetSubject) => {
      targetSubject.next({
        method,
        args,
        resolve,
        reject,
      })
    })
  } else {
    if (!manager.subjectsBeCallInfoQueue[target]) {
      manager.subjectsBeCallInfoQueue[target] = []
    }
    manager.subjectsBeCallInfoQueue[target].push({
      method,
      args,
      resolve,
      reject,
    })
  }
}
function callMethodWrapper(target, method, ...args) {
  const syncker = new AsyncSubject()
  const resolve = (value) => {
    syncker.next(value)
    syncker.complete()
  }
  const reject = (err) => {
    syncker.error(err)
  }
  callMethod(target, method, ...args, resolve, reject)
  const promise = new Promise((resolve, reject) => {
    syncker.subscribe({
      next(value) {
        resolve(value)
      },
      error(e) {
        reject(e)
      },
    })
  })
  return promise
}

export function inject(targetName) {
  if (window.Proxy === undefined) {
    console.error(
      `当前浏览器不支持 Proxy, 无法使用 inject api, 需要降级为 invoke api`
    )
  } else {
    return new Proxy(
      {},
      {
        get: function (target, method) {
          return new Proxy(function () {}, {
            apply: function (target, thisArg, args) {
              if (manager.mock?.[targetName]?.[method]) {
                return manager.mock[targetName][method](...args)
              } else {
                return callMethodWrapper(targetName, method, ...args)
              }
            },
          })
        },
      }
    )
  }
}
class Rdeco {
  constructor(name) {
    this.behaviorSubject = new BehaviorSubject(null)
    this.symbol = Symbol(name)
    this.behaviorSubject.symbol = this.symbol
    this.name = name
    manager.subjects[this.name] = []
    manager.subjects[this.name].push(this.behaviorSubject)
    this.unsubscribe = this.behaviorSubject.subscribe({
      next: (value) => {
        if (value) {
          const { method, args, resolve, reject } = value
          if (!this[method]) {
            // throw new Error(`${this.name} 类型不存在 ${method} 方法`)
          }
          console.debug(this)
          this[method](...args, resolve, reject)
        }
      },
    })
    if (manager.subjectsBeCallInfoQueue[this.name]) {
      manager.subjectsBeCallInfoQueue[this.name].forEach((callInfo) => {
        this.behaviorSubject.next(callInfo)
      })
    }
  }
  destroy() {
    this.unsubscribe()
    manager.removeSubject(this.name, this.symbol)
  }
}

export default Rdeco
