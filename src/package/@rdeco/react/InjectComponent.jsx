import React, { useEffect } from 'react'
import { inject } from '../module'

export function Inject(props) {
  const el = React.createRef()
  useEffect(() => {
    inject(this.props.name).render(el.current, props)
  }, [props])
  return <div ref={this.ref.el}></div>
}
