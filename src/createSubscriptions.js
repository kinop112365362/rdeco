/* eslint-disable react/display-name */
import { combination } from './combination'
import { forEachByKeys } from './utils/forEachByKeys'

function createSubscription(store) {
  const { subscribe, notification } = store
  return function bindSubject(subject) {
    console.debug(subject)
    let subscription = null
    subscription = subject.subscribe({
      next(value) {
        if (value === null) {
          return
        }
        // 代理订阅中的事件不包含 eventTargetMeta ,因为它不是一个标准的公共通道事件
        if (!value.eventTargetMeta && notification) {
          if (!notification[value.fnKey]) {
            throw new Error(
              `调用失败, ${store.name} 组件的 notification 上不存在 ${value.fnKey} 方法`
            )
          }
          return notification?.[value?.fnKey]?.call(
            store,
            value.data,
            value.next
          )
        }
        const { componentName, subjectKey, fnKey } = value?.eventTargetMeta
        const handle = () => {
          const meta = subscribe?.[subjectKey]?.find((meta) => {
            const [target] = meta
            return target === componentName
          })
          if (meta) {
            meta[1][fnKey]?.call(store, value.data)
          }
        }
        if (subjectKey === 'state') {
          console.debug(fnKey)
          setTimeout(() => {
            handle()
          }, 33)
        } else {
          handle()
        }
      },
    })
    return subscription
  }
}
function createRouterSubscription(store) {
  if (store.router) {
    return combination.routerSubjects[store.baseSymbol].subscribe({
      next(value) {
        if (value) {
          store.router[value.subjectKey].call(store, value.arg)
        }
      },
    })
  }
}
function createSelfSubscription(bindSubject, store, proxySubject) {
  if (store.notification) {
    return bindSubject(proxySubject.subject)
  }
}
export function createSubscriptions(store, proxySubject) {
  const subscriptions = []
  const bindSubject = createSubscription(store)
  if (store.subscribe) {
    const subscribeIds = combination.subscribeIds[store.baseSymbol]
    forEachByKeys(subscribeIds, (subjectKey) => {
      subscribeIds[subjectKey].forEach((subscribeId) => {
        combination.$connectAsync(subscribeId, (target) => {
          bindSubject(target.subjects[subjectKey])
        })
      })
    })
  }
  const routerSubscription = createRouterSubscription(store)
  const selfSubscription = createSelfSubscription(
    bindSubject,
    store,
    proxySubject
  )
  return { routerSubscription, selfSubscription, subscriptions }
}
