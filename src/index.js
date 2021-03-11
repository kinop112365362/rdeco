/* eslint-disable react/display-name */
import React, { useReducer, useContext } from 'react'
import { AppContext } from './app-context'
import mergeWith from 'lodash.mergewith'
import { merge } from 'lodash'
import { combination } from './combination'
import { storeConfigValidate } from './utils/store-config-validate'
import { isFunction } from './utils/is-function'
import { isStateIsUndefined } from './utils/is-state-is-undefined'
import { actionIsUndefined } from './utils/action-is-undefined'
import { getReducerModel, getReducerType } from './get-reducer-model'
import { bindContext } from './bind-context'

class Store {
  constructor(rawStoreConfig) {
    let storeConfig = rawStoreConfig
    if (rawStoreConfig.membrane) {
      storeConfig = merge(rawStoreConfig, rawStoreConfig.membrane)
    }
    const { viewKeys, ctrlKeys, serviceKeys } = storeConfigValidate(storeConfig)
    this.state = { ...storeConfig.initState }
    this.refs = { ...storeConfig.ref }
    this.styles = { ...storeConfig.styles }
    this.context = null
    /** props 到底是否有其实际价值? 暂时不放在任何 context 中看看情况 */
    this.props = null
    const baseContext = {
      state: this.state,
      refs: this.refs,
      styles: this.styles,
      context: this.context,
    }
    /** create this.rc
     * rc 只支持对 2 级 Key 做 State 快捷操作,
     * 从设计角度讲, 2 层 state 结构足够满足大多数复杂的场景,
     * 因此不提供嵌套 set, 避免开发者对状态设计产生工具便利性的依赖
     */
    this.stateKeys = Object.keys(this.state)
    this.rc = {
      setState: (nextState) => {
        if (isFunction(nextState)) {
          this.dispatch(['setState', nextState(this.state)])
        }
        isStateIsUndefined(nextState, this.stateKeys)
        this.dispatch(['setState', nextState])
      },
    }
    this.stateKeys.forEach((stateKey) => {
      const type = getReducerType(stateKey)
      this.rc[type] = (payload) => {
        if (isFunction(payload)) {
          this.dispatch([type, payload(this.state[stateKey])])
        } else {
          this.dispatch([type, payload])
        }
      }
    })

    this.private = {
      controllerContext: { ...baseContext },
      viewContext: { ...baseContext },
      serviceContext: { ...baseContext },
    }

    const {
      view,
      controller,
      service,
      hook = {
        controllerWrapper: null,
        viewWrapper: null,
        serviceWrapper: null,
      },
    } = storeConfig
    if (view) {
      this.state.viewCtrl = {}
      viewKeys.forEach((viewKey) => {
        this.state.viewCtrl[viewKey] = true
      })
    }
    const viewBindContext = this.bindViewContext(
      viewKeys,
      view,
      hook.viewWrapper
    )
    const ctrlBindContext = bindContext(
      ctrlKeys,
      controller,
      this.private.controllerContext,
      hook.controllerWrapper
    )
    const serviceBindContext = bindContext(
      serviceKeys,
      service,
      this.private.serviceContext,
      hook.serviceWrapper
    )
    this.private.serviceContext.service = serviceBindContext
    this.private.serviceContext.controller = ctrlBindContext
    this.private.serviceContext.rc = this.rc

    this.private.controllerContext.service = serviceBindContext
    this.private.controllerContext.view = viewBindContext
    this.private.controllerContext.rc = this.rc
    this.private.controllerContext.combination = combination

    this.private.viewContext.controller = ctrlBindContext
    this.private.viewContext.view = viewBindContext
    this.private.viewContext.combination = combination

    this.view = viewBindContext
    this.controller = ctrlBindContext
  }
  dispatch() {
    throw new Error('dispatch 没有被正确初始化, 请检查 hook 初始化部分的代码')
  }
  bindViewContext(fnKeys, fnObj, hook = null) {
    if (!fnObj) {
      return {}
    }
    const fnObjBindContext = {}
    fnKeys.forEach((fnKey) => {
      fnObjBindContext[fnKey] = (...args) => {
        if (hook) {
          return (
            <>
              {this.state.viewCtrl[fnKey] &&
                hook.call(
                  this.private.viewContext,
                  (...args) =>
                    fnObj[fnKey].call(this.private.viewContext, ...args),
                  fnKey,
                  ...args
                )}
            </>
          )
        }
        return (
          <>
            {this.state.viewCtrl[fnKey] &&
              fnObj[fnKey].call(this.private.viewContext, ...args)}
          </>
        )
      }
    })
    return fnObjBindContext
  }
  updateFunctionContextStateAndContext({ state, context }) {
    for (const contextName in this.private) {
      if (Object.hasOwnProperty.call(this.private, contextName)) {
        this.private[contextName]['state'] = state
        this.private[contextName]['context'] = context
      }
    }
  }
  update(state, context, dispatch, props) {
    this.updateFunctionContextStateAndContext({ state, context })
    this.dispatch = dispatch
    this.context = context
    this.props = props
  }
}

export function createStore(storeConfig, enhance) {
  let store = new Store(storeConfig)
  if (enhance) {
    store = enhance.reduce((prevFn, fn) => {
      return fn(prevFn(store))
    })
  }

  if (storeConfig.name) {
    combination[storeConfig.name] = {
      controller: store.controller,
      view: store.view,
    }
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
  return (props) => {
    const context = useContext(AppContext)
    const [state, dispatch] = useReducer(reducer, store.state)
    store.update(state, context, dispatch, props)
    return {
      view: store.view,
      state,
      refs: store.refs,
      controller: store.controller,
    }
  }
}
