import React, { useEffect } from 'react'
import { inject } from '../module'
import { createComponent } from './createComponent'

export const Inject = createComponent({
  name: '@rdeco/react-inject',
  ref: {
    el: React.createRef(),
  },
  controller: {
    onRender() {
      inject(this.props.name).render(this.ref.el.current, this.props)
    },
  },
  view: {
    render() {
      useEffect(() => {
        console.log('render', this.props)
        this.controller.onRender()
      }, [this.props])
      return <div ref={this.ref.el}></div>
    },
  },
})
