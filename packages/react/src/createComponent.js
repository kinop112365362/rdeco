/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react'
import { useComponent } from './useComponent'
import deepmerge from 'deepmerge'

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
  return HookComponent
}
