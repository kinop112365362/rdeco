/* eslint-disable react/display-name */
// @filename: index.js
import { useReducer, useContext } from 'react'
import { AppContext } from './app-context'
import mergeWith from 'lodash.mergewith'
import { combination } from './combination'
import { actionIsUndefined } from './utils/action-is-undefined'
import { getReducerModel } from './get-reducer-model'
import { Store } from './Store'

export function createStore(storeConfig, enhance) {
  let store = new Store(storeConfig)
  if (enhance) {
    if (enhance.length > 1) {
      store = enhance.reduce((prevFn, fn) => {
        return fn(prevFn(store, storeConfig))
      })
    }
    store = enhance[0](store)
  }

  if (storeConfig.name) {
    combination[storeConfig.name] = store
  }
  const reducer = (state, action) => {
    const stateKeys = Object.keys(store.state)
    const reducerModel = getReducerModel(stateKeys)(state)
    actionIsUndefined(reducerModel, action)
    const result = reducerModel[action[0]](action[1])
    // console.group(action[0])
    // console.log('prev store.state =>', state)
    // console.log('next state =>', action[1])
    // console.groupEnd()
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
