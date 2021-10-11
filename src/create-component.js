/* eslint-disable react/prop-types */
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { combination } from './combination'
import { createReducer } from './create-store'
import { Store } from './Store'
import { createCubject, subject } from './subject'
import { subscribeHandle } from './subscribe-handle'

function builderStore(storeConfig, enhance) {
  let store
  store = new Store(storeConfig)
  if (enhance) {
    if (enhance.length > 1) {
      store = enhance.reduce((prevFn, fn) => {
        if (typeof prevFn === 'object') {
          return fn(prevFn, storeConfig)
        }
        return fn(prevFn(store, storeConfig), storeConfig)
      })
    } else {
      if (enhance[0] && typeof enhance[0] === 'function') {
        store = enhance[0](store, storeConfig)
      }
    }
  }
  createCubject.next({
    componentName: storeConfig.name,
    meta: storeConfig,
  })
  return store
}

export function enhanceCreateComponent(enhances) {
  return function createComponent(component) {
    if (!module.hot) {
      if (combination[component.name]) {
        throw new Error(`${component.name} 重复, 创建失败, 请检查`)
      }
    }
    const initStore = builderStore(component, enhances)
    function HookComponent(props) {
      const storeConfig = { ...component }
      const [store, setStore] = useState(initStore)
      const [state, dispatch] = useReducer(createReducer(storeConfig), {
        ...store.state,
      })
      const ref = useRef(storeConfig.ref).current
      useEffect(() => {
        combination.$remove(store.name)
        const nextStore = builderStore(component, enhances)
        nextStore.update(state, null, dispatch, props, ref)
        combination.$set(storeConfig, nextStore)
        const sub = subject.subscribe({
          next: (v) => {
            if (
              storeConfig.godSubscribe &&
              !v.eventName.includes(storeConfig.name)
            ) {
              if (v.eventName.includes('_state_')) {
                return setTimeout(() => {
                  storeConfig.godSubscribe?.state?.call(nextStore, v.data)
                }, 33)
              }
              if (v.eventName.includes('_controller_')) {
                return setTimeout(() => {
                  storeConfig.godSubscribe?.controller?.call(nextStore, v.data)
                }, 33)
              }
              if (v.eventName.includes('_view_')) {
                return setTimeout(() => {
                  storeConfig.godSubscribe?.view?.call(nextStore, v.data)
                }, 33)
              }
              if (v.eventName.includes('_service_')) {
                return setTimeout(() => {
                  storeConfig.godSubscribe?.service?.call(nextStore, v.data)
                }, 33)
              }
            } else {
              if (
                combination.deps[storeConfig.name] &&
                combination.deps[storeConfig.name][v.eventName]
              ) {
                if (
                  v.eventName.includes('_controller_') ||
                  v.eventName.includes('_state_')
                ) {
                  setTimeout(() => {
                    combination.deps[storeConfig.name][v.eventName].call(
                      nextStore,
                      v.data
                    )
                  }, 33)
                }
              }
            }
          },
        })
        let createSub = null
        if (storeConfig.createShadowSubscribe) {
          createSub = createCubject.subscribe({
            next: (v) => {
              const newSubscribe = storeConfig.createShadowSubscribe(v, store)
              if (newSubscribe !== undefined) {
                subscribeHandle(storeConfig.name, {
                  [v.componentName]: newSubscribe,
                })
              }
            },
          })
        }
        setStore(nextStore)
        return () => {
          if (createSub) {
            createSub.unsubscribe()
          }
          sub.unsubscribe()
          store.dispose()
        }
      }, [])
      store.update(state, null, dispatch, props, ref)
      combination.$set(storeConfig, store)
      return <>{store.view.render()}</>
    }

    Object.defineProperty(HookComponent, 'name', {
      value: `${component.name}`,
    })
    return HookComponent
  }
}

export const createComponent = enhanceCreateComponent([])
