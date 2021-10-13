/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react'
import { combination } from './combination'
import {
  useStoreDispose,
  useStoreUpdate,
  useSubscribe,
} from './use-store-hooks'
import { Store } from './Store'
import { createStoreCubject } from './subject'
import createName from './utils/create-name'

function createStore(storeConfig) {
  const store = new Store(storeConfig)
  createStoreCubject.next({
    componentName: createName(storeConfig),
    meta: storeConfig,
  })
  return store
}

export function enhanceCreateComponent() {
  return function createComponent(component) {
    if (!module.hot) {
      if (combination[component.name]) {
        throw new Error(`${component.name} 重复, 创建失败, 请检查`)
      }
    }
    if (combination.$has(component)) {
      throw new Error(
        `该 ${component.name} 组件已经被创建过了, 请使用另外的 name 来声明`
      )
    }
    function HookComponent(props) {
      const storeConfig = useRef({ ...component }).current
      const store = useRef(null)
      const isNotMounted = useRef(true)
      if (isNotMounted.current) {
        if (props.sid) {
          storeConfig.sid = props.sid
          if (!combination.$has(storeConfig)) {
            store.current = createStore(storeConfig)
            combination.$set(storeConfig, store.current)
          } else {
            throw new Error(
              `该 sid ${props.sid} 在 ${storeConfig.name} 组件渲染过程中被使用了, 请使用唯一的 sid 值`
            )
          }
        } else {
          store.current = createStore(storeConfig)
          combination.$set(storeConfig, store.current)
        }
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
}

export const createComponent = enhanceCreateComponent([])
