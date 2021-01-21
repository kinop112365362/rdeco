import { useContext, useReducer } from 'react'
import { createReducer, reducerHelper, createRC } from './reducer-utils'
import { initStateMetaHandler } from './init-state-meta-handler'
import { AppContext } from './app-context'
import { createControllerBind } from './create-controller-bind'
import { createServiceBind } from './create-service-bind'
import { createRefs } from './create-refs'
import { createViewBind } from './create-view-bind'
import { membrane } from './create-membrane'

export const createStoreHook = (storeConfig) => {
  const storeStateConfig = initStateMetaHandler(storeConfig)
  const reducer = reducerHelper(createReducer(storeStateConfig.stateKeys))
  return function useStore(...props) {
    if (props.length > 0 && !membrane[name]) {
      throw new Error(
        ` 这个 store ${name} 并没有设置 membrane, 传入的参数将不会起到任何作用 ${props}`
      )
    }
    const context = useContext(AppContext)
    const [state, dispatch] = useReducer(
      reducer,
      storeStateConfig.initState,
      storeStateConfig.init
    )
    const rc = createRC(storeStateConfig.stateKeys, dispatch, state)
    const refs = createRefs(storeStateConfig.refKeys, storeConfig.ref)
    const callEffectContext = {
      name,
      rc,
      state,
      refs,
      context,
    }
    const serviceContext = createServiceBind(
      storeConfig.service,
      Object.freeze(callEffectContext)
    )
    const controllerBind = createControllerBind(
      storeConfig.controller,
      Object.freeze({ ...callEffectContext, service: serviceContext })
    )
    const viewBind = createViewBind(
      storeConfig.view,
      Object.freeze({
        controller: controllerBind,
        state,
        refs,
        context,
      })
    )
    return Object.freeze({
      state,
      refs,
      controller: controllerBind,
      view: viewBind,
    })
  }
}
