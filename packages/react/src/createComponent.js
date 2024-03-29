/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react'
import { useComponent } from './useComponent'
import deepmerge from 'deepmerge'
import { combination, create } from '@rdeco/core/'

export function createReqComponent(componentConfig) {
  const Component = createComponent(componentConfig)
  create({
    name: `${componentConfig.name}/req-entry`,
    exports: {
      getComponent(resolve) {
        resolve(Component)
      },
    },
  })
  return createComponent(componentConfig)
}

export function createComponent(componentConfig) {
  const component = deepmerge({}, componentConfig)
  const baseSymbol = component.name

  function HookComponent(props) {
    const store = useComponent(component, props)
    return <>{store.view.render()}</>
  }
  if (component.reactComponentName) {
    Object.defineProperty(HookComponent, 'name', {
      value: `${component.reactComponentName}`,
    })
  } else {
    Object.defineProperty(HookComponent, 'name', {
      value: `${component.name}`,
    })
  }
  HookComponent.symbol = baseSymbol
  if (!combination.reactComponents[component.name]) {
    combination.reactComponents[component.name] = HookComponent
  }
  return HookComponent
}
