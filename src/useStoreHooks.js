/* eslint-disable react/display-name */
import { useEffect } from 'react'
import { combination } from './combination'
import { nextTick } from './useStoreDispose'

function createSubscription({ subscribe, notification }, store) {
  return function bindSubject(subject) {
    let subscription = null
    subscription = subject.subscribe({
      next(value) {
        if (value === null) {
          return
        }
        // 代理订阅中的事件不包含 eventTargetMeta ,因为它不是一个标准的公共通道事件
        if (!value.eventTargetMeta && notification) {
          return nextTick(() => {
            if (!notification[value.fnKey]) {
              throw new Error(
                `调用失败, ${store.name} 组件的 notification 上不存在 ${value.fnKey} 方法`
              )
            }
            notification?.[value?.fnKey]?.call(store, value.data, value.syncker)
          })
        }
        const { componentName, subjectKey, fnKey, sid } = value?.eventTargetMeta
        if (subjectKey === 'state') {
          setTimeout(() => {
            subscribe?.[componentName]?.state?.call(store, value.data, sid)
          }, 33)
        } else {
          nextTick(() => {
            subscribe?.[componentName]?.[subjectKey]?.[fnKey]?.call(
              store,
              value.data,
              sid
            )
          })
        }
      },
    })
    return subscription
  }
}

export function useSubscribe(storeConfig, store) {
  useEffect(() => {
    const subscriptions = []
    let routerSubscription = null
    let selfSubscription = null
    const bindSubject = createSubscription(storeConfig, store)
    if (storeConfig?.subscribe) {
      const subscribeNamesKeys = Object.keys(combination.subscribeNames)
      subscribeNamesKeys.forEach((name) => {
        const subscribeNames = Object.keys(combination.subscribeNames[name])
        subscribeNames.forEach((subscribeName) => {
          combination.subscribeNames[name][subscribeName].forEach(
            (subjectKey) => {
              const componentKeys = Object.keys(combination.components)
              const reg = new RegExp(`^${subscribeName}`)
              const targets = componentKeys.filter((componentKey) => {
                return reg.test(componentKey)
              })
              targets.forEach((target) => {
                const subscription = bindSubject(
                  combination.components[target].subjects[subjectKey]
                )
                subscriptions.push(subscription)
              })
            }
          )
        })
      })
    }
    if (storeConfig.router) {
      routerSubscription = combination.routerSubjects[store.name].subscribe({
        next(value) {
          if (value) {
            storeConfig.router[value.subjectKey].call(store, value.arg)
          }
        },
      })
    }
    if (storeConfig.notification) {
      selfSubscription = bindSubject(combination.proxySubjects[store.name])
    }
    return () => {
      subscriptions.forEach((sub) => {
        sub.unsubscribe()
      })
      routerSubscription?.unsubscribe()
      selfSubscription?.unsubscribe()
    }
  }, [])
}
