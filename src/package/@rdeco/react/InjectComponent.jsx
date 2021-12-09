/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { inject } from '../module'

export function Inject(props) {
  const el = React.createRef()
  let deps = []
  if (props.deps) {
    deps = props.deps.map((dep) => {
      return props[dep]
    })
  }
  useEffect(() => {
    console.debug(deps, '---deps---')
    inject(props.name).render(el.current, props)
  }, deps)
  return <div ref={el}></div>
}
