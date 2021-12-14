/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from 'react'
import { combination, createMembrane, Store } from '../core'
import { useSubscribe } from './reactHooks/useSubscribe'
import { useStoreDispose } from './reactHooks/useStoreDispose'
import { useStoreUpdate } from './reactHooks/useStoreUpdate'
import { validate } from '../core/utils/validate'
import { getContext } from './ContextManager'

export function useComponent(component, props) {
  let baseSymbol = validate(component.name)
  const storeConfig = useRef({ ...component }).current
  const contextRef = useRef({}).current
  if (storeConfig.reactContext) {
    storeConfig.reactContext.forEach((key) => {
      contextRef[key] = useContext(getContext(key))
    })
  }
  const store = useRef(null)
  const isNotMounted = useRef(true)
  if (isNotMounted.current) {
    storeConfig.baseSymbol = baseSymbol
    storeConfig.props = props
    if (props.membrane) {
      if (props.membrane.name) {
        baseSymbol = storeConfig.baseSymbol = validate(props.membrane.name)
      } else {
        baseSymbol = storeConfig.baseSymbol
      }
      store.current = new Store(createMembrane(storeConfig, props.membrane))
    } else {
      store.current = new Store(storeConfig)
    }
  }
  useEffect(() => {
    isNotMounted.current = false
    combination.$register(baseSymbol, store.current)
    if (store.current?.controller?.onMount) {
      store.current.controller.onMount()
    }
  }, [])
  useStoreUpdate(store.current, store.current.state, props, contextRef)
  useSubscribe(store.current)
  useStoreDispose(store.current)
  return store.current
}
