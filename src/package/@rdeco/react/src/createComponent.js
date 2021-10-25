/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'
// eslint-disable-next-line import/no-unresolved
import { combination, createStore } from '../../core/src'
import { useSubscribe } from './reactHooks/useSubscribe'
import { useStoreDispose } from './reactHooks/useStoreDispose'
import { useStoreUpdate } from './reactHooks/useStoreUpdate'
import { validate } from '../../core/src/utils/validate'

export function createComponent(component) {
  const baseSymbol = validate(component.name)
  function HookComponent(props) {
    const storeConfig = useRef({ ...component }).current
    const store = useRef(null)
    const isNotMounted = useRef(true)
    const proxySubject = useRef(null)
    if (isNotMounted.current) {
      storeConfig.baseSymbol = baseSymbol
      store.current = createStore(storeConfig)
      proxySubject.current = combination.$set(baseSymbol, store.current)
    }
    useEffect(() => {
      isNotMounted.current = false
      if (store.current?.controller?.onMount) {
        store.current.controller.onMount()
      }
    }, [])
    useStoreUpdate(store.current, store.current.state, props)
    useSubscribe(store.current, proxySubject.current)
    useStoreDispose(store.current)
    return <>{store.current.view.render()}</>
  }

  Object.defineProperty(HookComponent, 'name', {
    value: `${component.name}`,
  })
  HookComponent.symbol = baseSymbol
  return HookComponent
}
