/* eslint-disable react/display-name */
import { useReducer, useRef, useEffect } from 'react'
import { actionIsUndefined } from './utils/action-is-undefined'
import { getReducerModel, getStateType } from './utils/get-reducer-model'
import { isFunction } from './utils/is-function'
import {
  stateSubject,
  viewSubject,
  controllerSubject,
  serviceSubject,
  hooksSubject,
} from './subject'
import deepmerge from 'deepmerge'
// import createName from './utils/create-name'
// import { combination } from './combination'

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
  stateSubject.next({
    eventTargetMeta: {
      componentName: action[3],
      subjectKey: 'state',
    },
    data: {
      key: getStateType(action[0]),
      prevState: state,
      nextState: newState,
    },
  })

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
function createSubscription({ subscribe, createShadowSubscribe }, store) {
  return function bindSubject(subject) {
    let subscription = null
    subscription = subject.subscribe({
      next(value) {
        const { componentName, subjectKey, fnKey } = value.eventTargetMeta
        if (subjectKey === 'state') {
          if (subscribe[componentName]) {
            nextTick(() => {
              subscribe[componentName]?.state?.call(store, value.data)
            })
          }
        } else {
          if (
            subscribe[componentName] &&
            subscribe[componentName][subjectKey] &&
            subscribe[componentName][subjectKey][fnKey]
          ) {
            nextTick(() => {
              subscribe[componentName][subjectKey][fnKey].call(
                store,
                value.data
              )
            })
          }
        }
        if (createShadowSubscribe) {
          const shadowSubscribe = createShadowSubscribe(value.eventTargetMeta)
          if (subjectKey === 'state') {
            if (shadowSubscribe) {
              nextTick(() => {
                shadowSubscribe?.state?.call(store, value.data)
              })
            }
          }
          if (
            shadowSubscribe &&
            shadowSubscribe[subjectKey] &&
            shadowSubscribe[subjectKey][fnKey]
          ) {
            nextTick(() => {
              shadowSubscribe[subjectKey][fnKey].call(store, value.data)
            })
          }
        }
      },
    })
    return subscription
  }
}

export function useSubscribe(storeConfig, store) {
  useEffect(() => {
    // const context = combination.components[createName(storeConfig)]
    let stateSubscription = null
    let viewSubscription = null
    let controllerSubscription = null
    let serviceSubscription = null
    let hooksSubscription = null

    if (storeConfig?.subscribe) {
      if (isFunction(storeConfig.subscribe)) {
        storeConfig.subscribe = storeConfig.subscribe()
      }
      const bindSubject = createSubscription(storeConfig, store)
      stateSubscription = bindSubject(stateSubject)
      viewSubscription = bindSubject(viewSubject)
      controllerSubscription = bindSubject(controllerSubject)
      serviceSubscription = bindSubject(serviceSubject)
      hooksSubscription = bindSubject(hooksSubject)
    }
    return () => {
      stateSubscription?.unsubscribe()
      viewSubscription?.unsubscribe()
      serviceSubscription?.unsubscribe()
      controllerSubscription?.unsubscribe()
      hooksSubscription?.unsubscribe()
    }
  }, [])
}
