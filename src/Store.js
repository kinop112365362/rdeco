/* eslint-disable valid-jsdoc */
/* eslint-disable react/display-name */
// @filename: Store.js
import mergeWith from 'lodash.mergewith'
// import { subject } from './behaviorSubject'
import { bindContext } from './bind-context'
import { combination } from './combination'
import { getReducerType } from './get-reducer-model'
import { asyncSubject } from './subject'
import { isStateIsUndefined } from './utils/is-state-is-undefined'
import { storeConfigValidate } from './utils/store-config-validate'
// import cloneDeep from 'lodash.clonedeep'
// eslint-disable-next-line valid-jsdoc
export class Store {
  constructor(rawStoreConfig) {
    let storeConfig = { ...rawStoreConfig }
    if (storeConfig.membrane) {
      storeConfig = mergeWith(
        storeConfig,
        storeConfig.membrane,
        (objValue, srcValue) => {
          if (Array.isArray(objValue)) {
            return [...srcValue]
          }
        }
      )
    }
    if (storeConfig.remote) {
      storeConfig = mergeWith(
        storeConfig,
        storeConfig.remote,
        (objValue, srcValue) => {
          if (Array.isArray(objValue)) {
            return [...srcValue]
          }
        }
      )
    }

    const { viewKeys, ctrlKeys, serviceKeys } = storeConfigValidate(storeConfig)
    if (storeConfig.initState) {
      this.state = { ...storeConfig.initState }
    } else {
      this.state = { ...storeConfig.state }
    }
    if (storeConfig.derived) {
      this.derived = {}
      const propsObj = {}
      const derivedKeys = Object.keys(storeConfig.derived)
      derivedKeys.forEach((derivedKey) => {
        propsObj[derivedKey] = {
          get: () => {
            return storeConfig.derived[derivedKey].call(this)
          },
        }
      })
      Object.defineProperties(this.derived, propsObj)
    }
    this.name = storeConfig.name
    if (storeConfig.sid) {
      this.name = `${storeConfig.name}_${storeConfig.sid}`
    }
    if (storeConfig.subscribe) {
      const targetComponentKeys = Object.keys(storeConfig.subscribe)
      targetComponentKeys.forEach((targetComponentKey) => {
        const eventKeys = Object.keys(storeConfig.subscribe[targetComponentKey])
        eventKeys.forEach((eventKey) => {
          const handle = storeConfig.subscribe[targetComponentKey][eventKey]
          if (eventKey === 'state') {
            combination.$addDep(this.name, {
              eventName: `${targetComponentKey}_state_finaly`,
              handle,
            })
          } else {
            combination.$addDep(this.name, {
              eventName: `${targetComponentKey}_controller_${eventKey}`,
              handle,
            })
          }
        })
      })
    }
    this.styles = { ...storeConfig.styles }
    this.style = { ...storeConfig.style }
    this.context = {}
    this.props = {}
    this.connect = combination.$connect.bind(combination)
    this.connectAsync = combination.$connectAsync.bind(combination)
    this.finalyState = () => {
      asyncSubject.complete()
    }

    const baseContext = {
      name: this.name,
      state: this.state,
      derived: this.derived,
      styles: this.styles,
      style: this.style,
      context: this.context,
      props: this.props,
      connect: this.connect,
      connectAsync: this.connectAsync,
      finalyState: this.finalyState,
      entites: combination.entites,
    }
    /** create this.rc
     * rc 只支持对 2 级 Key 做 State 快捷操作,
     * 从设计角度讲, 2 层 state 结构足够满足大多数复杂的场景,
     * 因此不提供嵌套 set, 避免开发者对状态设计产生工具便利性的依赖
     */
    this.stateKeys = Object.keys(this.state)
    this.rc = {
      setState: (nextState) => {
        console.warn(
          `this.rc.setState 已弃用, 自 1.24.6 开始使用 this.setter.state 代替, 该 API 会在 未来的版本中被完全废弃`
        )
        isStateIsUndefined(nextState, this.stateKeys)
        this.dispatch(['setState', nextState, 'state'])
        return nextState
      },
    }
    this.stateKeys.forEach((stateKey) => {
      const type = getReducerType(stateKey)
      this.rc[type] = (payload) => {
        console.warn(
          `this.rc.set[stateName] 已弃用, 自 1.24.6 开始使用 this.setter.[stateName] 代替, 该 API 会在 未来的版本中被完全废弃`
        )
        this.dispatch([type, payload, stateKey])
      }
    })
    //用 setter 优化 rc 的语义
    this.setter = {
      state: (nextState) => {
        isStateIsUndefined(nextState, this.stateKeys)
        this.dispatch(['setState', nextState, 'state'])
        return nextState
      },
    }
    this.stateKeys.forEach((stateKey) => {
      const type = getReducerType(stateKey)
      this.setter[stateKey] = (payload) => {
        this.dispatch([type, payload, stateKey])
        return payload
      }
    })

    this.private = {
      controllerContext: { ...baseContext },
      viewContext: { ...baseContext },
      serviceContext: { ...baseContext },
    }
    const instance = this
    const { view, controller, service } = storeConfig
    const viewBindContext = bindContext(
      viewKeys,
      view,
      this.private.viewContext,
      instance,
      false
    )
    const ctrlBindContext = bindContext(
      ctrlKeys,
      controller,
      this.private.controllerContext,
      instance,
      true
    )
    const serviceBindContext = bindContext(
      serviceKeys,
      service,
      this.private.serviceContext,
      instance,
      false
    )
    this.private.serviceContext.service = serviceBindContext
    this.private.serviceContext.rc = this.rc
    this.private.serviceContext.setter = this.setter
    this.private.serviceContext.combination = combination

    this.private.controllerContext.service = serviceBindContext
    this.private.controllerContext.rc = this.rc
    this.private.controllerContext.setter = this.setter
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
  mixinPrivateContext(contextName, key, value) {
    this.private[contextName][key] = value
  }
  updateFunctionContextStateAndContextAndProps({
    state,
    // subscribeState,
    context,
    props,
    ref,
  }) {
    this.props = props
    for (const contextName in this.private) {
      if (Object.hasOwnProperty.call(this.private, contextName)) {
        this.private[contextName]['state'] = state
        this.private[contextName]['context'] = context
        // this.private[contextName]['subscribeState'] = subscribeState
        this.private[contextName]['props'] = props
        this.private[contextName]['ref'] = ref
        this.private[contextName]['refs'] = ref
      }
    }
  }
  dispose() {
    if (this.name) {
      if (this.sid) {
        combination.$remove(`${this.name}_${this.sid}`)
      } else {
        combination.$remove(`${this.name}`)
      }
    }
  }
  update(state, context, dispatch, props, ref) {
    this.updateFunctionContextStateAndContextAndProps({
      state,
      // subscribeState,
      context,
      props,
      ref,
    })
    this.dispatch = dispatch
    this.state = state
    // this.subscribeState = subscribeState
    this.ref = ref
  }
}
