import { useContext, useReducer } from 'react'
import pick from 'object.pick'
import { createReducer, reducerHelper, createRC } from './reducer-utils'
import { initStateMetaHandler } from './init-state-meta-handler'
import { AppContext } from './app-context'
import { createStoreBindContext } from './create-store-bind-context'
import { createRefs } from './create-refs'

export function createStoreTakenMembraneHook(storeConfig, membraneStoreConfig) {
  if (!storeConfig.ref) {
    storeConfig.ref = {}
  }
  if (!membraneStoreConfig.ref) {
    membraneStoreConfig.ref = {}
  }
  const storeStateConfig = initStateMetaHandler(storeConfig)
  const membraneStoreStateConfig = initStateMetaHandler(membraneStoreConfig)
  const mergedStateKeys = [
    ...storeStateConfig.stateKeys,
    ...membraneStoreStateConfig.stateKeys,
  ]
  const reducer = reducerHelper(createReducer(mergedStateKeys))
  return function useMembraneStore(props) {
    const context = useContext(AppContext)
    const [state, dispatch] = useReducer(
      reducer,
      {
        ...storeStateConfig.initState,
        ...membraneStoreStateConfig.initState,
      },
      (initArgs) =>
        membraneStoreStateConfig.init(storeStateConfig.init(initArgs))
    )

    const mergedRef = {
      ref: {
        ...storeConfig.ref,
        ...membraneStoreConfig.ref,
      },
      refKeys: [
        ...storeStateConfig.refKeys,
        ...membraneStoreStateConfig.refKeys,
      ],
    }
    const rc = createRC(mergedStateKeys, dispatch, state)
    const refs = createRefs(mergedRef.refKeys, mergedRef.ref)
    const sharedContext = {
      rc,
      refs,
      state,
    }
    const superBindContext = createStoreBindContext(
      context,
      storeConfig,
      sharedContext
    )
    const finlayStore = createStoreBindContext(
      context,
      membraneStoreConfig,
      sharedContext,
      superBindContext,
      props
    )
    return Object.freeze({
      state: pick(finlayStore.state, storeStateConfig.stateKeys),
      refs: pick(finlayStore.refs, storeStateConfig.refKeys),
      controller: pick(
        finlayStore.controller,
        Object.keys(storeConfig.controller)
      ),
      view: pick(finlayStore.view, Object.keys(storeConfig.view)),
    })
  }
}
