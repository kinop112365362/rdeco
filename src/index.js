import { useReducer, useContext } from 'react'
import { AppContext } from './core/app-context'

const combination = {}
function isFunction(value) {
  return typeof value === 'function'
}
function isStateIsUndefined(nextState, stateKeys) {
  const nextStateKeys = Object.keys(nextState)
  const ghostKeys = nextStateKeys.filter((key) => !stateKeys.includes(key))
  if (ghostKeys.length) {
    throw new Error(
      `不存在的 state => [${ghostKeys.toString()}], 请确保setState中更新的state在initState中已经声明`
    )
  }
}
class Store {
  constructor(storeConfig) {
    this.state = { ...storeConfig.initState }
    this.stateKeys = Object.keys(this.state)
    this.refs = { ...storeConfig.refs }
    this.styles = { ...storeConfig.styles }
    this.props = null
    const baseContext = {
      state: this.state,
      refs: this.refs,
      styles: this.styles,
    }
    this.private = {
      controllerContext: { ...baseContext },
      viewContext: { ...baseContext },
      serviceContext: { ...baseContext },
      controllerHookContext: { ...baseContext },
      serviceHookContext: { ...baseContext },
      viewHookContext: { ...baseContext },
    }
    function bindContext(fnObj, context, hook = null) {
      const fnObjBindContext = {}
      const fnKeys = Object.keys(fnObj)
      fnKeys.forEach((fnKey) => {
        fnObjBindContext[fnKey] = (...args) => {
          if (hook) {
            return hook(fnObj[fnKey].bind(context, ...args), fnKey, ...args)
          }
          return fnObj[fnKey].call(context, ...args)
        }
      })
      return fnObjBindContext
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
    const viewBindContext = bindContext(
      view,
      this.private.viewContext,
      hook.viewWrapper
    )
    const ctrlBindContext = bindContext(
      controller,
      this.private.controllerContext,
      hook.viewWrapper
    )
    const serviceBindContext = bindContext(
      service,
      this.private.serviceContext,
      hook.viewWrapper
    )
    this.private.serviceContext.service = serviceBindContext
    this.private.serviceContext.controller = ctrlBindContext
    this.private.controllerContext.service = serviceBindContext
    this.private.controllerContext.view = viewBindContext
    this.private.viewContext.controller = ctrlBindContext
    this.private.viewContext.view = viewBindContext
  }
  dispatch() {
    throw new Error('dispatch 没有被正确初始化, 请检查 hook 初始化部分的代码')
  }
  setState(nextState) {
    if (isFunction(nextState)) {
      this.dispatch(['setState', nextState(this.state)])
    }
    isStateIsUndefined(nextState, this.stateKeys)
    this.dispatch(['setState', nextState])
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
    this.props = props
  }
}

export function createStore(storeConfig, enhance) {
  const store = new Store(storeConfig)
  const enhanceStore = enhance.reduce((prevFn, fn) => {
    return fn(prevFn(store))
  })
  if (storeConfig.name) {
    if (combination[storeConfig.name] !== undefined) {
      throw new Error(`Store(${storeConfig.name}) 已经被初始化过了`)
    }
    combination[storeConfig.name] = {
      controller: enhanceStore.controller,
      view: enhanceStore.view,
    }
  }
  return (props) => {
    const context = useContext(AppContext)
    const [state, dispatch] = useReducer(store.initState)
    store.update(state, context, dispatch, props)
    return store
  }
}
