/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef } from 'react'
import {
  combination,
  createMembrane,
  Store,
  getRegisterMembrane,
} from '@rdeco/core'
import { useSubscribe } from './reactHooks/useSubscribe'
import { useStoreDispose } from './reactHooks/useStoreDispose'
import { useStoreUpdate } from './reactHooks/useStoreUpdate'
import { getContext } from './ContextManager'

export function useComponent(component, props) {
  let baseSymbol = component.name
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
    const baseMembrane = getRegisterMembrane(props?.membrane?.name)
    let finlayMembrane = props.membrane
    if (baseMembrane) {
      finlayMembrane = createMembrane(baseMembrane, props.membrane)
    }
    if (finlayMembrane) {
      if (finlayMembrane.name) {
        baseSymbol = storeConfig.baseSymbol = finlayMembrane.name
      } else {
        baseSymbol = storeConfig.baseSymbol
      }
      store.current = new Store(createMembrane(storeConfig, finlayMembrane))
    } else {
      store.current = new Store(storeConfig)
    }
  }
  useEffect(() => {
    isNotMounted.current = false
    combination.$register(baseSymbol, store.current, storeConfig.single)
    if (store.current?.controller?.onMount) {
      store.current.controller.onMount()
    }
  }, [])
  useStoreUpdate(store.current, store.current.state, props, contextRef)
  useSubscribe(store.current)
  useStoreDispose(store.current)
  return store.current
}
