/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import { combination, Store } from '../core'
import { useSubscribe } from './reactHooks/useSubscribe'
import { useStoreDispose } from './reactHooks/useStoreDispose'
import { useStoreUpdate } from './reactHooks/useStoreUpdate'
import { validate } from '../core/utils/validate'

export function useComponent(component, props) {
  const baseSymbol = validate(component.name)
  const storeConfig = useRef({ ...component }).current
  const store = useRef(null)
  const isNotMounted = useRef(true)
  if (isNotMounted.current) {
    storeConfig.baseSymbol = baseSymbol
    storeConfig.props = props
    store.current = new Store(storeConfig)
    combination.$register(baseSymbol, store.current)
  }
  useEffect(() => {
    isNotMounted.current = false
    if (store.current?.controller?.onMount) {
      store.current.controller.onMount()
    }
  }, [])
  useStoreUpdate(store.current, store.current.state, props)
  useSubscribe(store.current)
  useStoreDispose(store.current)
  return store.current
}