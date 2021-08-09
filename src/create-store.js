/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import { useReducer, useContext, useRef, useEffect, useState } from 'react'
import { AppContext } from './app-context'
import mergeWith from 'lodash.mergewith'
import { actionIsUndefined } from './utils/action-is-undefined'
import { getReducerModel } from './get-reducer-model'
import { Store } from './Store'
import { isFunction } from './utils/is-function'
import { combination } from './combination'
import { ee } from './event'

export function createStore(storeConfig, enhance) {
  let store
  if (combination.$has(storeConfig)) {
    store = combination.$find(storeConfig.name, storeConfig.sid)
  } else {
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
    combination.$set(storeConfig, store)
  }
  const reducer = (state, action) => {
    const stateKeys = Object.keys(store.state)
    const reducerModel = getReducerModel(stateKeys)(state)
    actionIsUndefined(reducerModel, action)
    let result = null
    if (isFunction(action[1])) {
      if (action[2] === 'state') {
        result = reducerModel[action[0]](action[1](state))
      } else {
        result = reducerModel[action[0]](action[1](state[action[2]]))
      }
    } else {
      result = reducerModel[action[0]](action[1])
    }
    const newState = mergeWith(state, result, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return [...srcValue]
      }
    })
    return { ...newState }
  }
  return function (props) {
    const context = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, { ...store.state })
    const [force, forceUpdate] = useState(new Date().getTime())
    const ref = useRef(storeConfig.ref).current
    useEffect(() => {
      const handle = () => {
        forceUpdate(new Date().getTime())
      }
      ee.on(store.name, handle)
      return () => {
        ee.off(store.name, handle)
      }
    }, [])
    store.update(state, context, dispatch, props, ref)
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
