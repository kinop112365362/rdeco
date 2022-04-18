/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react'
import { useComponent } from './useComponent'
import deepmerge from 'deepmerge'
import { combination } from '@rdeco/core/lib/store/combination'
export function createComponent(componentConfig) {
  const component = deepmerge({}, componentConfig)
  const baseSymbol = component.name

  function HookComponent(props) {
    const store = useComponent(component, props)
    return <>{store.view.render()}</>
  }

  Object.defineProperty(HookComponent, 'name', {
    value: `${component.name}`,
  })
  HookComponent.symbol = baseSymbol
  if (componentConfig.exports) {
    componentConfig.exports.getComponent = function (resolve) {
      resolve(HookComponent)
    }
  } else {
    componentConfig.exports = {
      getComponent(resolve) {
        resolve(HookComponent)
      },
    }
  }
  if (!combination.reactComponents[component.name]) {
    combination.reactComponents[component.name] = HookComponent
  }
  return HookComponent
}
