import { useEffect, useReducer, useRef } from 'react'
import { reducer } from '../reducer'

export function useStoreUpdate(store, nextState, props, contextRef) {
  const [state, dispatch] = useReducer(reducer, nextState)
  const ref = useRef(store.ref).current
  useEffect(() => {
    store.setterCallbacks.forEach((callback = () => {}) => {
      callback()
    })
    store.setterCallbacks = []
  }, [state])
  store.update((ctx) => {
    for (const contextName in ctx.private) {
      if (Object.hasOwnProperty.call(ctx.private, contextName)) {
        ctx.private[contextName]['state'] = state
        ctx.private[contextName]['props'] = props
        ctx.private[contextName]['ref'] = ref
        ctx.private[contextName]['reactContext'] = contextRef
      }
    }
    ctx.dispatch = dispatch
    ctx.state = state
    ctx.ref = ref
    ctx.props = props
  })
}
