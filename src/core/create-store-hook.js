import { useContext, useReducer, useRef } from 'react'
import pick from 'object.pick'
import { reducerUtils, createReducerCase } from './reducer-utils'
import { AppContext } from './app-context'

export const createStoreHook = {
  writeGetUseReducerConfig(storeConfig) {
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
      useReducerConfig.init = (state) => state
      useReducerConfig.stateKeys = Object.keys(initStateMeta)
    }
    return useReducerConfig
  },
  writeGetUseReducerConfigWithMembrane(storeConfig) {
    const superUseReducerConfig = this.writeGetUseReducerConfig(storeConfig)
    if (storeConfig.membrane) {
      const membraneUseReducerConfig = this.writeGetUseReducerConfig(
        storeConfig.membrane
      )
      return {
        stateKeys: {
          ...superUseReducerConfig.stateKeys,
          ...membraneUseReducerConfig.stateKeys,
        },
        initState: {
          ...superUseReducerConfig.initState,
          ...membraneUseReducerConfig.initState,
        },
        init(initArgs) {
          return membraneUseReducerConfig.init(
            superUseReducerConfig.init(initArgs)
          )
        },
        refKeys: {
          ...superUseReducerConfig.refKeys,
          ...membraneUseReducerConfig.refKeys,
        },
      }
    }
    return superUseReducerConfig
  },
  writeGetControllerKeys(storeConfig) {
    const controllerKeys = Object.keys(storeConfig.controller)
    controllerKeys.forEach((controllerKey) => {
      const isNotStartWithON = !controllerKey.startsWith('on')
      if (isNotStartWithON) {
        throw new Error(`${controllerKey} 命名必须以 on 开头, 名词 + 动词结尾`)
      }
    })
  },
  writeGetController({ controller }, contextProps, serviceBindContext) {
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
  },
  writeControllerBindHandler(target, contextProps, serviceBindContext) {
    return async (...args) => {
      const res = await target.call(
        Object.freeze({
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
  },
  writeServiceBindHandler(target, contextProps, serviceBindContext) {
    return async (...args) => {
      const res = await target.call(
        Object.freeze({
          state: contextProps.state,
          refs: contextProps.refs,
          service: serviceBindContext,
          super: contextProps.superContext || null,
        }),
        ...args
      )
      return res
    }
  },
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
  },
  writeGetView({ view }, viewContext) {
    const viewBind = {}
    if (view) {
      const viewKeys = Object.keys(view)
      viewKeys.forEach((viewKey) => {
        viewBind[viewKey] = view[viewKey].bind(viewContext)
      })
    }
    return viewBind
  },
  writeGetViewContext(
    controllerBindContext,
    storeConfig,
    { state, refs, props, superContext = null }
  ) {
    return Object.freeze({
      controller: controllerBindContext,
      state,
      refs,
      context,
      props,
      view: storeConfig.view,
      super: superContext,
    })
  },
  writeGetStoreBindContext(storeConfig, useReducerConfig, contextProps) {
    const store = {}
    const serviceBindContext = this.writeGetService(storeConfig, contextProps)
    const controllerBindContext = this.writeGetController(
      storeConfig,
      contextProps,
      serviceBindContext
    )
    const viewBindContext = this.writeGetView(
      storeConfig,
      this.writeGetViewContext(controllerBindContext)
    )
    store.rc = contextProps.rc
    store.service = serviceBindContext
    store.state = contextProps.state
    store.refs = contextProps.refs
    store.controller = controllerBindContext
    store.view = viewBindContext
    if (storeConfig.membrane) {
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
        storeConfig,
        this.writeGetViewContext(membraneControllerBindContext)
      )
      store.view = membraneViewBindContext
      store.controller = membraneControllerBindContext
      store.service = membraneServiceBindContext
      return Object.freeze({
        state: pick(store.state, useReducerConfig.stateKeys),
        refs: pick(store.refs, useReducerConfig.refKeys),
        controller: pick(store.controller, Object.keys(storeConfig.controller)),
        view: pick(store.view, Object.keys(storeConfig.view)),
      })
    }
    return store
  },
  writeGetRefs(refsKeys, refs) {
    const refContext = {}
    if (refsKeys) {
      refsKeys.forEach((refKey) => {
        refContext[refKey] = useRef(refs[refKey])
      })
    }
    return refContext
  },
  writeGetRef(storeConfig) {
    if (storeConfig.membrane) {
      return {
        ...storeConfig.ref,
        ...storeConfig.membrane.ref,
      }
    }
    return storeConfig.ref
  },
  readPropsHasNoMembrane(storeConfig, props) {
    if (!storeConfig.membrane && props) {
      throw new Error(
        `${storeConfig.name} 没有定义 membrane, 传递进来的 props 是无效的`
      )
    }
  },
  readControllerIsNone(storeConfig) {
    if (!storeConfig.controller) {
      throw new Error('任何一个 store 都不能没有 controller')
    }
  },
  main(storeConfig) {
    this.readControllerIsInvalid(storeConfig)
    this.readControllerIsNone(storeConfig)
    const useReducerConfig = this.writeGetUseReducerConfigWithMembrane(
      storeConfig
    )
    const { stateKeys, init, initState, refKeys } = useReducerConfig
    const ref = this.writeGetRef(storeConfig)
    const reducer = reducerUtils.main(stateKeys)
    return (props) => {
      this.readPropsHasNoMembrane(storeConfig, props)
      const context = useContext(AppContext)
      const [state, dispatch] = useReducer(reducer, initState, init)
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
  },
}
