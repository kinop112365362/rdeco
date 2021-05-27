import React from 'react'
import { createStore } from './create-store'

export function createComponent(component, membrane = {}) {
  component.membrane = membrane
  const useComponent = createStore(component)
  return function HookComponent(props) {
    const store = useComponent(props)
    return <>{store.view.render()}</>
  }
}
