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
      if (props.sid) {
        component.sid = props.sid
        copy.sid = props.sid
        createCubject.next({
          componentName: `${copy.name}_${copy.sid}`,
          sid: copy.sid,
          meta: copy,
        })
      }

      const useComponent = createStore(copy, enhances)
      const store = useComponent(props)
      let isRender = true
      if (props.if === false) {
        isRender = false
      }
      if (props.foreach) {
        return (
          <>
            {isRender &&
              props.foreach.list.map((l) => {
                return React.createElement(HookComponent, {
                  key: l[props.foreach.keyName],
                  sid: l[props.foreach.keyName],
                  ...l,
                })
              })}
          </>
        )
      }
      return <>{isRender && store.view.render()}</>
    }
    if (component.name) {
      if (component.sid) {
        Object.defineProperty(HookComponent, 'name', {
          value: `${component.name}_${component.sid}`,
        })
      } else {
        Object.defineProperty(HookComponent, 'name', {
          value: `${component.name}`,
        })
      }
    }
    return HookComponent
  }
}

export const createComponent = enhanceCreateComponent([])
