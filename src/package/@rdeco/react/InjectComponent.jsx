import React from 'react'
import { inject } from '../module'
import { createComponent } from './createComponent'

export const Inject = createComponent({
  name: '@rdeco/react-inject',
  ref: {
    el: React.createRef(),
  },
  controller: {
    onMount() {
      console.debug(this.ref.el, this.props.name)
      inject(this.props.name).render(this.ref.el.current, this.props)
    },
  },
  view: {
    render() {
      return <div ref={this.ref.el}></div>
    },
  },
})
