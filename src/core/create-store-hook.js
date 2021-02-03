import { useContext, useReducer, useRef } from 'react'
import pick from 'object.pick'
import { reducerUtils, createReducerCase } from './reducer-utils'
import { AppContext } from './app-context'

class CreateStoreHook {
  // @@ 获取 useReducer 的配置
  writeGetUseReducerConfig(storeConfig) {
    if (storeConfig.initState === undefined) {
      storeConfig.initState = {}
    }
    const { initState: initStateMeta, ref } = storeConfig
    const useReducerConfig = {
      refKeys: Object.keys(ref),
    }
    const initStateMetaIsArray = Array.isArray(initStateMeta)
    if (initStateMetaIsArray) {
      useReducerConfig.initState = initStateMeta[0]
      useReducerConfig.init = initStateMeta[1]
      useReducerConfig.stateKeys = Object.keys(initStateMeta[0])
    } else {
      useReducerConfig.initState = initStateMeta
      useReducerConfig.init = function init(initArgs) {
        return initArgs
      }
      useReducerConfig.stateKeys = Object.keys(initStateMeta)
    }
    if (useReducerConfig.stateKeys.indexOf('state') !== -1) {
      throw new Error(
        'State cannot be declared as a key in initState, which would conflict with the default setState function'
      )
    }
    return useReducerConfig
  }
  // @@ Membrane 模式下获取 useReducer 配置
  writeGetUseReducerConfigWithMembrane(storeConfig) {
    const superUseReducerConfig = this.writeGetUseReducerConfig(storeConfig)
    if (storeConfig.membrane) {
      const membraneUseReducerConfig = this.writeGetUseReducerConfig(
        storeConfig.membrane
      )
      return {
        stateKeys: [
          ...superUseReducerConfig.stateKeys,
          ...membraneUseReducerConfig.stateKeys,
        ],
        initState: {
          ...superUseReducerConfig.initState,
          ...membraneUseReducerConfig.initState,
        },
        init(initArgs) {
          return membraneUseReducerConfig.init.call(
            this,
            superUseReducerConfig.init.call(this, initArgs)
          )
        },
        refKeys: [
          ...superUseReducerConfig.refKeys,
          ...membraneUseReducerConfig.refKeys,
        ],
      }
    }
    return superUseReducerConfig
  }
  // @@ 获取 controller 的 KeyMap
  writeGetControllerKeys(controller) {
    const controllerKeys = Object.keys(controller)
    controllerKeys.forEach((controllerKey) => {
      const isNotStartWithON = !controllerKey.startsWith('on')
      if (isNotStartWithON) {
        throw new Error(`${controllerKey} 命名必须以 on 开头, 名词 + 动词结尾`)
      }
    })
    return controllerKeys
  }
  // @@ 绑定 controller 的 context
  writeGetController({ controller }, contextProps, serviceBindContext) {
    this.readControllerIsNone({ controller })
    const controllerBindContext = {}
    const controllerKeys = this.writeGetControllerKeys(controller)
    controllerKeys.forEach((controllerKey) => {
      const controllerIsArray = Array.isArray(controller[controllerKey])
      if (controllerIsArray) {
        controllerBindContext[controllerKey] = this.writeControllerBindHandler(
          controller[controllerKey][1],
          contextProps,
          serviceBindContext
        )
      } else {
        controllerBindContext[controllerKey] = this.writeControllerBindHandler(
          controller[controllerKey],
          contextProps,
          serviceBindContext
        )
      }
    })
    return controllerBindContext
  }
  // @@ controller 绑定 context 的 helper 函数
  writeControllerBindHandler(target, contextProps, serviceBindContext) {
    return (...args) => {
      const res = target.call(
        Object.freeze({
          context: contextProps.context,
          props: contextProps.props,
          state: contextProps.state,
          refs: contextProps.refs,
          rc: contextProps.rc,
          service: serviceBindContext,
          super: contextProps.superContext || null,
        }),
        ...args
      )
      return res
    }
  }
  // @@ service 绑定 context 的 helper 函数
  writeServiceBindHandler(target, contextProps, serviceBindContext) {
    return (...args) => {
      const res = target.call(
        Object.freeze({
          state: contextProps.state,
          refs: contextProps.refs,
          service: serviceBindContext,
          super: contextProps.superContext || null,
          rc: contextProps.rc,
        }),
        ...args
      )
      return res
    }
  }
  // @@ 绑定 service 的 context
  writeGetService({ service }, contextProps) {
    const serviceBindContext = {}
    if (service) {
      const serviceKeys = Object.keys(service)
      serviceKeys.forEach((serviceKey) => {
        const serviceIsArray = Array.isArray(service[serviceKey])
        if (serviceIsArray) {
          serviceBindContext[serviceKey] = this.writeServiceBindHandler(
            service[serviceKey][1],
            contextProps,
            serviceBindContext
          )
        } else {
          serviceBindContext[serviceKey] = this.writeServiceBindHandler(
            service[serviceKey],
            contextProps,
            serviceBindContext
          )
        }
      })
    }
    return serviceBindContext
  }
  // @@ 绑定 view 的 context
  writeGetView({ view }, viewContext) {
    const viewBindContext = {}
    viewContext.view = viewBindContext
    if (view) {
      const viewKeys = Object.keys(view)
      viewKeys.forEach((viewKey) => {
        viewBindContext[viewKey] = (...args) => {
          const res = view[viewKey].call(Object.freeze(viewContext), ...args)
          return res
        }
      })
    }
    return viewBindContext
  }
  // @@ 获取 view 的 context
  writeGetViewContext(
    controllerBindContext,
    storeConfig,
    { context, state, refs, props, superContext = null }
  ) {
    return {
      controller: controllerBindContext,
      state,
      refs,
      context,
      props,
      super: superContext,
    }
  }
  // @@ 获取 store 并兼容 Membrane 模式
  writeGetStoreWithMembrane(storeConfig, store, contextProps) {
    if (storeConfig.membrane) {
      const membraneStore = {}
      contextProps.superContext = store
      const membraneServiceBindContext = this.writeGetService(
        storeConfig.membrane,
        contextProps
      )
      const membraneControllerBindContext = this.writeGetController(
        storeConfig.membrane,
        contextProps,
        membraneServiceBindContext
      )
      const membraneViewBindContext = this.writeGetView(
        storeConfig.membrane,
        this.writeGetViewContext(
          membraneControllerBindContext,
          storeConfig.membrane,
          contextProps
        )
      )
      membraneStore.view = { ...store.view, ...membraneViewBindContext }
      membraneStore.controller = {
        ...store.controller,
        ...membraneControllerBindContext,
      }
      const { stateKeys, refKeys } = this.writeGetUseReducerConfig(storeConfig)
      return Object.freeze({
        state: pick(store.state, stateKeys),
        refs: pick(store.refs, refKeys),
        controller: pick(
          membraneStore.controller,
          Object.keys(storeConfig.controller)
        ),
        view: membraneStore.view,
      })
    }
    return Object.freeze(store)
  }
  // @@ 绑定 store 的 context
  writeGetStoreBindContext(storeConfig, useReducerConfig, contextProps) {
    let store = {}
    const serviceBindContext = this.writeGetService(storeConfig, contextProps)
    const controllerBindContext = this.writeGetController(
      storeConfig,
      contextProps,
      serviceBindContext
    )
    const viewBindContext = this.writeGetView(
      storeConfig,
      this.writeGetViewContext(controllerBindContext, storeConfig, contextProps)
    )
    store.rc = contextProps.rc
    store.service = serviceBindContext
    store.state = contextProps.state
    store.refs = contextProps.refs
    store.controller = controllerBindContext
    store.view = viewBindContext
    store = this.writeGetStoreWithMembrane(
      storeConfig,
      store,
      contextProps,
      useReducerConfig
    )
    return store
  }
  // @@ 获取 refs
  writeGetRefs(refsKeys, refs) {
    const refContext = {}
    if (refsKeys) {
      refsKeys.forEach((refKey) => {
        refContext[refKey] = useRef(refs[refKey])
      })
    }
    return refContext
  }
  // @@ 获取 ref
  writeGetRef(storeConfig) {
    if (!storeConfig.ref) {
      storeConfig.ref = {}
    }
    if (storeConfig.membrane) {
      if (!storeConfig.membrane.ref) {
        storeConfig.membrane.ref = {}
      }
      return {
        ...storeConfig.ref,
        ...storeConfig.membrane.ref,
      }
    }
    return storeConfig.ref
  }
  // @@ 处理 props 在未定义 Membrane 的情况下
  readPropsHasNoMembrane(storeConfig, props) {
    if (!storeConfig.membrane && props) {
      throw new Error(
        `${storeConfig.name} 没有定义 membrane, 传递进来的 props 是无效的`
      )
    }
  }
  // @@ 处理 controller 为定义
  readControllerIsNone(storeConfig) {
    if (!storeConfig.controller) {
      throw new Error('任何一个 store 都不能没有 controller')
    }
  }
  // @@ 处理是否 promise
  readIsPromise(obj) {
    return (
      !!obj &&
      (typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function'
    )
  }
  // @@ 入口函数
  main(storeConfig) {
    this.readControllerIsNone(storeConfig)
    const ref = this.writeGetRef(storeConfig)
    const useReducerConfig = this.writeGetUseReducerConfigWithMembrane(
      storeConfig
    )
    const { stateKeys, init, initState, refKeys } = useReducerConfig
    const reducer = reducerUtils.main(stateKeys)
    return (props) => {
      this.readPropsHasNoMembrane(storeConfig, props)
      const context = useContext(AppContext)
      const [state, dispatch] = useReducer(
        reducer,
        initState,
        function (initArgs) {
          return init.call({ context }, initArgs)
        }
      )
      const rc = createReducerCase.main(stateKeys, dispatch, state)
      const refs = this.writeGetRefs(refKeys, ref)
      const store = this.writeGetStoreBindContext(
        storeConfig,
        useReducerConfig,
        {
          context,
          rc,
          refs,
          state,
          props,
        }
      )
      return store
    }
  }
}

export const createStoreHook = new CreateStoreHook()
