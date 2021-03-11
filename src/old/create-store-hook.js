import { useContext, useReducer, useRef } from 'react'
import { reducerUtils, createReducerCase } from './reducer-utils'
import { AppContext } from '../app-context'
import merge from 'lodash.merge'

class CreateStoreHook {
  // constructor() {
  //   // eslint-disable-next-line no-undef
  //   this.combination = new Proxy(
  //     {},
  //     {
  //       get(target, p) {
  //         if (target[p] === undefined) {
  //           throw new Error(`${p} 尚未初始化, 无法联结`)
  //         }
  //         return target[p][0]
  //       },
  //       set(target, p, v) {
  //         if (target[p] === undefined) {
  //           target[p] = []
  //           target[p].push(v)
  //           // TODO 后续是否需要支持多实例? 更复杂的 event bus?
  //         }
  //         if (target[p].length > 1) {
  //           throw new Error(`${p} 具名 Store 不支持多实例, 请移除 name 属性`)
  //         }
  //         return v
  //       },
  //     }
  //   )
  // }
  // @@ 获取 useReducer 的配置
  // writeGetUseReducerConfig(storeConfig) {
  //   if (storeConfig.initState === undefined) {
  //     storeConfig.initState = {}
  //   }
  //   const { initState: initStateMeta, ref } = storeConfig
  //   const useReducerConfig = {
  //     refKeys: Object.keys(ref),
  //   }
  //   const initStateMetaIsArray = Array.isArray(initStateMeta)
  //   if (initStateMetaIsArray) {
  //     useReducerConfig.initState = initStateMeta[0]
  //     useReducerConfig.init = initStateMeta[1]
  //     useReducerConfig.stateKeys = Object.keys(initStateMeta[0])
  //   } else {
  //     useReducerConfig.initState = initStateMeta
  //     useReducerConfig.init = function init(initArgs) {
  //       return initArgs
  //     }
  //     useReducerConfig.stateKeys = Object.keys(initStateMeta)
  //   }
  //   if (useReducerConfig.stateKeys.indexOf('state') !== -1) {
  //     throw new Error(
  //       'State cannot be declared as a key in initState, which would conflict with the default setState function'
  //     )
  //   }
  //   return useReducerConfig
  // }
  // @@ Membrane 模式下获取 useReducer 配置
  // writeGetUseReducerConfigWithMembrane(storeConfig) {
  //   const superUseReducerConfig = this.writeGetUseReducerConfig(storeConfig)
  //   if (storeConfig.membrane) {
  //     const membraneUseReducerConfig = this.writeGetUseReducerConfig(
  //       storeConfig.membrane
  //     )
  //     return {
  //       stateKeys: [
  //         ...superUseReducerConfig.stateKeys,
  //         ...membraneUseReducerConfig.stateKeys,
  //       ],
  //       initState: {
  //         ...superUseReducerConfig.initState,
  //         ...membraneUseReducerConfig.initState,
  //       },
  //       init(initArgs) {
  //         return membraneUseReducerConfig.init.call(
  //           this,
  //           superUseReducerConfig.init.call(this, initArgs)
  //         )
  //       },
  //       refKeys: [
  //         ...superUseReducerConfig.refKeys,
  //         ...membraneUseReducerConfig.refKeys,
  //       ],
  //     }
  //   }
  //   return superUseReducerConfig
  // }
  // @@ 获取 controller 的 KeyMap
  // writeGetControllerKeys(controller) {
  //   const controllerKeys = Object.keys(controller)
  //   controllerKeys.forEach((controllerKey) => {
  //     const isNotStartWithON = !controllerKey.startsWith('on')
  //     if (isNotStartWithON) {
  //       throw new Error(`${controllerKey} 命名必须以 on 开头, 名词 + 动词结尾`)
  //     }
  //   })
  //   return controllerKeys
  // }
  // @@ 绑定 controller 的 context
  writeGetController(storeConfig, contextProps, serviceBindContext) {
    const controllerBindContext = {}
    const { controller, hook } = storeConfig
    this.readControllerIsNone({ controller })
    const controllerContext = Object.freeze({
      context: contextProps.context,
      props: contextProps.props,
      state: contextProps.state,
      refs: contextProps.refs,
      rc: contextProps.rc,
      service: serviceBindContext,
      styles: storeConfig.styles,
      combination: this.combination,
      // super: contextProps.superContext || null,
    })
    const controllerKeys = this.writeGetControllerKeys(controller)
    controllerKeys.forEach((controllerKey) => {
      const controllerIsArray = Array.isArray(controller[controllerKey])
      if (controllerIsArray) {
        controllerBindContext[controllerKey] = (...args) => {
          controller[controllerKey][1].call(controllerContext, ...args)
        }
      } else {
        controllerBindContext[controllerKey] = (...args) => {
          controller[controllerKey].call(controllerContext, ...args)
        }
      }
    })
    if (hook && hook.controllerWrapper) {
      const controllerBindContextWithHook = {}
      controllerKeys.forEach((controllerKey) => {
        controllerBindContextWithHook[controllerKey] = (...args) => {
          return hook.controllerWrapper.call(
            controllerContext,
            controller[controllerKey],
            controllerKey,
            ...args
          )
        }
      })
      return controllerBindContextWithHook
    }
    return controllerBindContext
  }
  // @@ service 绑定 context 的 helper 函数
  writeServiceBindHandler(target, contextProps, serviceBindContext) {
    return (...args) => {
      const res = target.call(
        Object.freeze({
          state: contextProps.state,
          refs: contextProps.refs,
          service: serviceBindContext,
          rc: contextProps.rc,
        }),
        ...args
      )
      return res
    }
  }
  // @@ 绑定 service 的 context
  writeGetService(storeConfig, contextProps) {
    const { service, hook } = storeConfig
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
      if (hook && hook.serviceWrapper) {
        const controllerBindContextWithHook = {}
        serviceKeys.forEach((serviceKey) => {
          controllerBindContextWithHook[serviceKey] = (...args) => {
            return hook.serviceWrapper.call(
              serviceBindContext,
              service[serviceKey],
              serviceKey,
              ...args
            )
          }
        })
        return controllerBindContextWithHook
      }
    }
    return serviceBindContext
  }
  // @@ 绑定 view 的 context
  writeGetView(storeConfig, viewContext, renderCache) {
    const viewBindContext = {}
    const { view, hook } = storeConfig
    viewContext.view = viewBindContext
    if (view) {
      const viewKeys = Object.keys(view)
      viewKeys.forEach((viewKey) => {
        if (Array.isArray(view[viewKey])) {
          viewBindContext[viewKey] = (...args) => {
            const fn = view[viewKey][0]
            const deps = view[viewKey][1](viewContext)
            let depsStr = ''
            try {
              depsStr = JSON.stringify(deps)
            } catch (error) {
              throw new Error(
                `view[${viewKey}] 的依赖函数无法 JSON 序列化, 请检查`
              )
            }
            if (renderCache[viewKey]) {
              if (!Object.is(renderCache[viewKey].depsStr, depsStr)) {
                const res = fn.call(Object.freeze(viewContext), ...args)
                return res
              } else {
                return renderCache[viewKey].value
              }
            } else {
              const res = fn.call(Object.freeze(viewContext), ...args)
              renderCache[viewKey] = {
                depsStr,
                value: res,
              }
              return res
            }
          }
        } else {
          viewBindContext[viewKey] = (...args) => {
            const res = view[viewKey].call(Object.freeze(viewContext), ...args)
            return res
          }
        }
      })
      // 当存在全局的 render 函数 hook, 才执行
      if (hook && hook.renderWrapper) {
        const viewBindContextWithHook = {}
        viewKeys.forEach((viewKey) => {
          viewBindContextWithHook[viewKey] = (...args) => {
            return hook.renderWrapper.call(
              {
                state: viewContext.state,
                refs: viewContext.refs,
                controller: viewContext.controller,
              },
              viewBindContext[viewKey],
              viewKey,
              ...args
            )
          }
        })
        viewContext.view = viewBindContextWithHook
        return viewBindContextWithHook
      }
    }
    return viewBindContext
  }
  // @@ 获取 view 的 context
  writeGetViewContext(controllerBindContext, storeConfig, contextProps) {
    return {
      controller: controllerBindContext,
      state: contextProps.state,
      refs: contextProps.refs,
      context: contextProps.context,
      props: contextProps.props,
      styles: storeConfig.styles,
      combination: this.combination,
      // super: superContext,
    }
  }
  // @@ 获取 store 并兼容 Membrane 模式
  // writeGetStoreWithMembrane(storeConfig, store, contextProps) {
  // 继承是一个不必要的模式, 现代软件开发的需求通过 hook + overload 可以覆盖 super 的场景, 该方法先弃用
  // if (storeConfig.membrane) {
  //   const membraneStore = {}
  //   contextProps.superContext = store
  //   const membraneServiceBindContext = this.writeGetService(
  //     storeConfig.membrane,
  //     contextProps
  //   )
  //   const membraneControllerBindContext = this.writeGetController(
  //     storeConfig.membrane,
  //     contextProps,
  //     membraneServiceBindContext
  //   )
  //   const membraneViewBindContext = this.writeGetView(
  //     storeConfig.membrane,
  //     this.writeGetViewContext(
  //       membraneControllerBindContext,
  //       storeConfig.membrane,
  //       contextProps
  //     )
  //   )
  //   membraneStore.view = { ...store.view, ...membraneViewBindContext }
  //   membraneStore.controller = {
  //     ...store.controller,
  //     ...membraneControllerBindContext,
  //   }
  //   const { stateKeys, refKeys } = this.writeGetUseReducerConfig(storeConfig)
  //   return Object.freeze({
  //     state: pick(store.state, stateKeys),
  //     refs: pick(store.refs, refKeys),
  //     controller: pick(
  //       membraneStore.controller,
  //       Object.keys(storeConfig.controller)
  //     ),
  //     view: membraneStore.view,
  //   })
  // }
  // return Object.freeze(store)
  // }
  // @@ 绑定 store 的 context
  writeGetStoreBindContext(
    storeConfig,
    useReducerConfig,
    contextProps,
    renderCache
  ) {
    let store = {}
    let storeConfigMergedMembrane = storeConfig
    if (storeConfig.membrane) {
      storeConfigMergedMembrane = merge(storeConfig, storeConfig.membrane)
    }
    const serviceBindContext = this.writeGetService(
      storeConfigMergedMembrane,
      contextProps
    )
    const controllerBindContext = this.writeGetController(
      storeConfigMergedMembrane,
      contextProps,
      serviceBindContext
    )
    const viewBindContext = this.writeGetView(
      storeConfigMergedMembrane,
      this.writeGetViewContext(
        controllerBindContext,
        storeConfigMergedMembrane,
        contextProps
      ),
      renderCache
    )
    store.rc = contextProps.rc
    store.service = serviceBindContext
    store.state = contextProps.state
    store.refs = contextProps.refs
    store.controller = controllerBindContext
    store.view = viewBindContext
    // store = this.writeGetStoreWithMembrane(
    //   storeConfig,
    //   store,
    //   contextProps,
    //   useReducerConfig
    // )
    // const { stateKeys, refKeys } = this.writeGetUseReducerConfig(storeConfig)
    // return Object.freeze({
    //   state: pick(store.state, stateKeys),
    //   refs: pick(store.refs, refKeys),
    //   controller: pick(store.controller, Object.keys(storeConfig.controller)),
    //   view: store.view,
    // })
    return Object.freeze(store)
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
  main(storeConfig, enhancer = (s) => s) {
    this.readControllerIsNone(storeConfig)
    const ref = this.writeGetRef(storeConfig)
    const useReducerConfig = this.writeGetUseReducerConfigWithMembrane(
      storeConfig
    )
    const { stateKeys, init, initState, refKeys } = useReducerConfig
    const reducer = reducerUtils.main(stateKeys)
    const renderCache = {}
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
        },
        renderCache
      )
      if (storeConfig.name) {
        this.combination[storeConfig.name] = {
          controller: {},
          view: {},
        }
        this.combination[storeConfig.name].controller = { ...store.controller }
        this.combination[storeConfig.name].view = { ...store.view }
      }
      return enhancer(store)
    }
  }
}

export const createStoreHook = new CreateStoreHook()
