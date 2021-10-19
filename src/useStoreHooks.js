/* eslint-disable react/display-name */
import { useEffect } from 'react'
import { isFunction } from './utils/isFunction'
import { combination } from './combination'
import { nextTick } from './useStoreDispose'

function createSubscription({ subscribe, proxySubscribe }, store) {
  return function bindSubject(subject) {
    let subscription = null
    subscription = subject.subscribe({
      next(value) {
        if (value === null) {
          return
        }
        // 代理订阅中的事件不包含 eventTargetMeta ,因为它不是一个标准的公共通道事件
        if (!value.eventTargetMeta && proxySubscribe) {
          return nextTick(() => {
            if (!proxySubscribe[value.fnKey]) {
              throw new Error(
                `调用失败, ${store.name} 组件的 proxySubscribe 上不存在 ${value.fnKey} 方法`
              )
            }
            proxySubscribe?.[value?.fnKey]?.call(
              store,
              value.data,
              value.syncker
            )
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
      if (isFunction(storeConfig.subscribe)) {
        storeConfig.subscribe = storeConfig.subscribe()
      }
      const subscribeNamesKeys = Object.keys(combination.subscribeNames)
      subscribeNamesKeys.forEach((name) => {
        const subscribeNames = Object.keys(combination.subscribeNames[name])
        subscribeNames.forEach((subscribeName) => {
          combination.subscribeNames[name][subscribeName].forEach(
            (subjectKey) => {
              if (subscribeName.includes(':')) {
                const componentKeys = Object.keys(combination.components)
                const targets = componentKeys.filter((componentKey) => {
                  return componentKey.includes(subscribeName.split(':')[0])
                })
                targets.forEach((target) => {
                  const subscription = bindSubject(
                    combination.components[target].subjects[subjectKey]
                  )
                  subscriptions.push(subscription)
                })
              } else {
                const subscription = bindSubject(
                  combination.components[subscribeName].subjects[subjectKey]
                )
                subscriptions.push(subscription)
              }
            }
          )
        })
      })
    }
    if (storeConfig.routerSubscribe) {
      routerSubscription = combination.routerSubjects[store.name].subscribe({
        next(value) {
          if (value) {
            storeConfig.routerSubscribe[value.subjectKey].call(store, value.arg)
          }
        },
      })
    }
    if (storeConfig.proxySubscribe) {
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
