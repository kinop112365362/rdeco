/* eslint-disable react/display-name */
import { useReducer, useRef, useEffect } from 'react'
import { actionIsUndefined } from './utils/action-is-undefined'
import { getReducerModel, getStateType } from './utils/get-reducer-model'
import { isFunction } from './utils/is-function'
import deepmerge from 'deepmerge'
import { combination } from './combination'

function reducer(state, action) {
  const stateKeys = Object.keys(state)
  const reducerModel = getReducerModel(stateKeys)(state)
  actionIsUndefined(reducerModel, action)
  if (isFunction(action[1])) {
    throw new Error(
      '自 1.40.2 开始不在支持 setter 操作中使用函数而非值, 请直接使用 this.state 来替代获取旧值'
    )
  }
  const result = reducerModel[action[0]](action[1])
  const newState = deepmerge(state, result, {
    arrayMerge: (objValue, srcValue) => {
      return srcValue
    },
  })
  const value = {
    eventTargetMeta: {
      componentName: action[3],
      subjectKey: 'state',
    },
    data: {
      key: getStateType(action[0]),
      prevState: state,
      nextState: newState,
    },
  }
  combination.$broadcast(action[3], value, 'state')

  return { ...newState }
}
export function useStoreUpdate(storeConfig, store, nextState, props) {
  const [state, dispatch] = useReducer(reducer, nextState)
  const ref = useRef(storeConfig.ref).current
  store.update(state, dispatch, props, ref)
}
export function useStoreDispose(store) {
  useEffect(() => {
    return () => {
      store.dispose()
    }
  }, [])
}
function nextTick(tick) {
  setTimeout(() => {
    tick()
  }, 33)
}
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
    if (storeConfig?.proxySubscribe) {
      selfSubscription = bindSubject(combination.proxySubjects[store.name])
    }
    return () => {
      stateSubscription?.unsubscribe()
      viewSubscription?.unsubscribe()
      serviceSubscription?.unsubscribe()
      controllerSubscription?.unsubscribe()
      hooksSubscription?.unsubscribe()
      selfSubscription?.unsubscribe()
    }
  }, [])
}
