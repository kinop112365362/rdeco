/* eslint-disable valid-jsdoc */
/* eslint-disable react/display-name */
// @filename: Store.js
import React from 'react'
import mergeWith from 'lodash.mergewith'
import { combination } from './combination'
import { storeConfigValidate } from './utils/store-config-validate'
import { isStateIsUndefined } from './utils/is-state-is-undefined'
import { getReducerType } from './get-reducer-model'
import { bindContext } from './bind-context'
import defaultsDeep from 'lodash.defaultsdeep'
// eslint-disable-next-line valid-jsdoc
export class Store {
  /**
   * @param rawStoreConfig { import("./types").StoreConfig }   用于创建 Store 的配置对象
   */
  constructor(rawStoreConfig) {
    let storeConfig = defaultsDeep({}, rawStoreConfig)
    if (storeConfig.membrane) {
      storeConfig = mergeWith(
        storeConfig,
        storeConfig.membrane,
        (objValue, srcValue) => {
          if (Array.isArray(objValue)) {
            return [...srcValue]
          }
          return { ...objValue, ...srcValue }
        }
      )
    }
    const { viewKeys, ctrlKeys, serviceKeys } = storeConfigValidate(storeConfig)
    this.state = { ...storeConfig.initState }
    this.refs = { ...storeConfig.ref }
    this.styles = { ...storeConfig.styles }
    this.context = {}
    /** props 到底是否有其实际价值? 暂时不放在任何 context 中看看情况 */
    this.props = {}
    const baseContext = {
      state: this.state,
      refs: this.refs,
      styles: this.styles,
      context: this.context,
      props: this.props,
    }
    /** create this.rc
     * rc 只支持对 2 级 Key 做 State 快捷操作,
     * 从设计角度讲, 2 层 state 结构足够满足大多数复杂的场景,
     * 因此不提供嵌套 set, 避免开发者对状态设计产生工具便利性的依赖
     */
    this.stateKeys = Object.keys(this.state)
    this.rc = {
      setState: (nextState) => {
        isStateIsUndefined(nextState, this.stateKeys)
        this.dispatch(['setState', nextState, 'state'])
      },
      setViewCtrl: (nextState) => {
        this.dispatch(['setViewCtrl', nextState, 'viewCtrl'])
      },
    }
    this.stateKeys.forEach((stateKey) => {
      const type = getReducerType(stateKey)
      this.rc[type] = (payload) => {
        this.dispatch([type, payload, stateKey])
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
      if (!this.state.viewCtrl) {
        this.state.viewCtrl = {}
      }
      viewKeys.forEach((viewKey) => {
        if (this.state.viewCtrl[viewKey] === undefined) {
          this.state.viewCtrl[viewKey] = true
        }
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
    this.private.serviceContext.rc = this.rc
    this.private.serviceContext.combination = combination

    this.private.controllerContext.service = serviceBindContext
    this.private.controllerContext.rc = this.rc
    this.private.controllerContext.combination = combination

    this.private.viewContext.controller = ctrlBindContext
    this.private.viewContext.view = viewBindContext
    this.private.viewContext.combination = combination

    this.view = viewBindContext
    this.controller = ctrlBindContext
    this.service = serviceBindContext
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
  mixinPrivateContext(contextName, key, value) {
    this.private[contextName][key] = value
  }
  updateFunctionContextStateAndContextAndProps({ state, context, props }) {
    for (const contextName in this.private) {
      if (Object.hasOwnProperty.call(this.private, contextName)) {
        this.private[contextName]['state'] = state
        this.private[contextName]['context'] = context
        this.private[contextName]['props'] = props
      }
    }
  }
  update(state, context, dispatch, props) {
    this.updateFunctionContextStateAndContextAndProps({ state, context, props })
    this.dispatch = dispatch
    this.state = state
  }
}
