/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'
import { combination } from './combination'
import {
  useStoreDispose,
  useStoreUpdate,
  useSubscribe,
} from './use-store-hooks'
import { Store } from './Store'
import { createStoreSubject } from './subject'
import createName from './utils/create-name'

function createStore(storeConfig) {
  const store = new Store(storeConfig)
  if (storeConfig.subscribe) {
    const subscribeNameKeys = Object.keys(storeConfig.subscribe)
    subscribeNameKeys.forEach((key) => {
      if (!combination.subscribeNames[key]) {
        // eslint-disable-next-line no-undef
        combination.subscribeNames[key] = new Set([])
      }
      combination.subscribeNames[key].add(store.name)
    })
  }
  createStoreSubject.next({
    componentName: createName(storeConfig),
    meta: storeConfig,
  })
  return store
}

export function createComponent(component) {
  if (!module.hot) {
    if (combination.$has(component)) {
      throw new Error(
        `该 ${component.name} 组件已经被创建过了, 请使用另外的 name 来声明`
      )
    }
  }
  function HookComponent(props) {
    const storeConfig = useRef({ ...component }).current
    const store = useRef(null)
    const isNotMounted = useRef(true)
    if (isNotMounted.current) {
      if (props.sid) {
        storeConfig.sid = props.sid
      }
      store.current = createStore(storeConfig)
      if (combination.components[store.current.name]) {
        console.error(
          `当前已经存在 ${store.current.name} 组件, 并且已挂载, 请检查 sid 是否唯一, 同时挂载两个同名组件实例, 可能导致 Subscribe 消息收发不正确`
        )
      }
      combination.$set(storeConfig, store.current)
    }
    useEffect(() => {
      isNotMounted.current = false
    }, [])
    useStoreUpdate(storeConfig, store.current, store.current.state, props)
    useSubscribe(storeConfig, store.current)
    useStoreDispose(store.current)
    return <>{store.current.view.render()}</>
  }

  Object.defineProperty(HookComponent, 'name', {
    value: `${component.name}`,
  })
  return HookComponent
}
