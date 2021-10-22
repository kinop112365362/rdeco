import { useReducer, useRef } from 'react'
import { reducer } from './reducer'

export function useStoreUpdate(store, nextState, props) {
  const [state, dispatch] = useReducer(reducer, nextState)
  const ref = useRef(store.ref).current
  store.update(state, dispatch, props, ref)
}
