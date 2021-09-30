/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { useReducer, useContext, useRef, useEffect, useState } from 'react'
import { AppContext } from './app-context'
import mergeWith from 'lodash.mergewith'
import { actionIsUndefined } from './utils/action-is-undefined'
import { getReducerModel, getStateType } from './get-reducer-model'
import { Store } from './Store'
import { isFunction } from './utils/is-function'
import { combination } from './combination'
import { subject, asyncSubject, createCubject } from './subject'
import { subscribeHandle } from './subscribe-handle'

const createReducer = (name) => (state, action) => {
  const stateKeys = Object.keys(state)
  const reducerModel = getReducerModel(stateKeys)(state)
  actionIsUndefined(reducerModel, action)
  // let result = null
  // if (isFunction(action[1])) {
  //   if (action[2] === 'state') {
  //     result = reducerModel[action[0]](action[1](state))
  //   } else {
  //     result = reducerModel[action[0]](action[1](state[action[2]]))
  //   }
  // } else {
  if (isFunction(action[1])) {
    throw new Error(
      '自 1.40.2 开始不在支持 setter 操作中使用函数而非值, 请直接使用 this.state 来替代获取旧值'
    )
  }
  const result = reducerModel[action[0]](action[1])
  // }
  const newState = mergeWith(state, result, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return [...srcValue]
    }
  })
  if (name) {
    subject.next({
      eventName: `${name}_state_finaly`,
      data: {
        key: getStateType(action[0]),
        prevState: state,
        nextState: newState,
      },
    })
  }
  return { ...newState }
}
export function createStore(storeConfig, enhance) {
  let store
  store = new Store(storeConfig)
  if (enhance) {
    if (enhance.length > 1) {
      store = enhance.reduce((prevFn, fn) => {
        if (typeof prevFn === 'object') {
          return fn(prevFn, storeConfig)
        }
        return fn(prevFn(store, storeConfig), storeConfig)
      })
    } else {
      if (enhance[0] && typeof enhance[0] === 'function') {
        store = enhance[0](store, storeConfig)
      }
    }
  }

  return function (props) {
    const context = useContext(AppContext)
    const [state, dispatch] = useReducer(createReducer(store.name), {
      ...store.state,
    })
    const ref = useRef(storeConfig.ref).current
    useEffect(() => {
      const sub = subject.subscribe({
        next: (v) => {
          if (
            combination.deps[store.name] &&
            combination.deps[store.name][v.eventName]
          ) {
            setTimeout(() => {
              combination.deps[store.name][v.eventName].call(store, v.data)
            }, 33)
          }
        },
      })
      let createSub = null
      if (storeConfig.dynamicSubscribe) {
        createSub = createCubject.subscribe({
          next: (v) => {
            const newSubscribe = storeConfig.dynamicSubscribe(v)
            console.debug(newSubscribe)
            if (newSubscribe !== undefined) {
              console.debug({
                [v.componentName]: newSubscribe,
              })
              subscribeHandle(storeConfig.name, {
                [v.componentName]: newSubscribe,
              })
            }
          },
        })
      }
      return () => {
        if (createSub) {
          createSub.unsubscribe()
        }
        sub.unsubscribe()
        store.dispose()
      }
    }, [])
    store.update(state, context, dispatch, props, ref)
    combination.$set(storeConfig, store)
    /**
     * @type {store.state} state
     */
    return {
      view: store.view,
      state,
      derived: store.derived,
      refs: ref,
      ref: ref,
      controller: store.controller,
    }
  }
}
