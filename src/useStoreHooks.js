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
        if (!value.eventTargetMeta) {
          return nextTick(() => {
            if (!proxySubscribe[value.fnKey]) {
              throw new Error(
                `调用失败, ${store.name} 组件的 proxySubscribe 上不存在 ${value.fnKey} 方法`
              )
            }
            proxySubscribe?.[value?.fnKey]?.call(store, value.data)
          })
        }
        const { componentName, subjectKey, fnKey, sid } = value?.eventTargetMeta
        if (subjectKey === 'state') {
          nextTick(() => {
            subscribe?.[componentName]?.state?.call(store, value.data, sid)
          })
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
    let stateSubscription = null
    let viewSubscription = null
    let controllerSubscription = null
    let serviceSubscription = null
    let hooksSubscription = null
    let selfSubscription = null
    let routerSubscription = null
    const bindSubject = createSubscription(storeConfig, store)
    if (storeConfig?.subscribe) {
      if (isFunction(storeConfig.subscribe)) {
        storeConfig.subscribe = storeConfig.subscribe()
      }
      stateSubscription = bindSubject(store.subjects.stateSubject)
      viewSubscription = bindSubject(store.subjects.viewSubject)
      controllerSubscription = bindSubject(store.subjects.controllerSubject)
      serviceSubscription = bindSubject(store.subjects.serviceSubject)
      hooksSubscription = bindSubject(store.subjects.hooksSubject)
    }
    if (storeConfig.routerSubscribe) {
      routerSubscription = combination.routerSubjects[store.name].subscribe({
        next(value) {
          if (value) {
            storeConfig.routerSubscribe.change.call(store, value)
          }
        },
      })
    }
    if (storeConfig.proxySubscribe) {
      selfSubscription = bindSubject(combination.proxySubjects[store.name])
    }
    return () => {
      stateSubscription?.unsubscribe()
      viewSubscription?.unsubscribe()
      serviceSubscription?.unsubscribe()
      controllerSubscription?.unsubscribe()
      hooksSubscription?.unsubscribe()
      selfSubscription?.unsubscribe()
      routerSubscription?.unsubscribe()
    }
  }, [])
}
