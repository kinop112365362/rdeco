import { useReducer, useRef } from 'react'
import { reducer } from './reducer'

export function useStoreUpdate(storeConfig, store, nextState, props) {
  const [state, dispatch] = useReducer(reducer, nextState)
  const ref = useRef(storeConfig.ref).current
  store.update(state, dispatch, props, ref)
}
