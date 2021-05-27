/* eslint-disable react/display-name */
import { useReducer, useContext } from 'react'
import { AppContext } from './app-context'
import mergeWith from 'lodash.mergewith'
import { actionIsUndefined } from './utils/action-is-undefined'
import { getReducerModel } from './get-reducer-model'
import { Store } from './Store'
import { isFunction } from './utils/is-function'

export function createStore(storeConfig, enhance) {
  let store = new Store(storeConfig)
  if (enhance) {
    if (enhance.length > 1) {
      store = enhance.reduce((prevFn, fn) => {
        return fn(prevFn(store, storeConfig), storeConfig)
      })
    } else {
      store = enhance[0](store, storeConfig)
    }
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
    store.update(state, context, dispatch, props)
    /**
     * @type {store.state} state
     */
    return {
      view: store.view,
      state,
      refs: store.refs,
      controller: store.controller,
    }
  }
}
