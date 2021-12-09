/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { inject } from '../module'

export function Inject(props) {
  const el = React.createRef()
  const scope = new Date().getTime()
  useEffect(() => {
    inject(props.name).render(el.current, props, scope)
  }, [props])
  return <div ref={el}></div>
}
