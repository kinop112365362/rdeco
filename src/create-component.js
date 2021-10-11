/* eslint-disable react/prop-types */
import React from 'react'
import { combination } from './combination'
import { createStore } from './create-store'
import { createCubject } from './subject'

export function enhanceCreateComponent(enhances) {
  return function createComponent(component) {
    if (!module.hot) {
      if (combination[component.name]) {
        throw new Error(`${component.name} 重复, 创建失败, 请检查`)
      }
    }
    function HookComponent(props) {
      const copy = { ...component }
      const useComponent = createStore(copy, enhances)
      const store = useComponent(props)
      createCubject.next({
        componentName: copy.name,
        meta: copy,
      })

      return <>{store.view.render()}</>
    }

    Object.defineProperty(HookComponent, 'name', {
      value: `${component.name}`,
    })
    return HookComponent
  }
}

export const createComponent = enhanceCreateComponent([])
