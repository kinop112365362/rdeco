/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from 'react'
import { validate } from '@rdeco/core/src'
import { useComponent } from './useComponent'

export function createComponent(component) {
  const baseSymbol = validate(component.name)
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
