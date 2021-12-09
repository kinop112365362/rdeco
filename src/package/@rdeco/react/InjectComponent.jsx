import React, { useEffect } from 'react'
import { inject } from '../module'
import { createComponent } from './createComponent'

export const Inject = createComponent({
  name: '@rdeco/react-inject',
  ref: {
    id: new Date().getTime(),
  },
  controller: {
    onRender() {
      inject(this.props.name).render(
        document.getElementById(this.ref.id),
        this.props
      )
    },
  },
  view: {
    render() {
      useEffect(() => {
        this.controller.onRender()
      }, [this.props])
      return <div id={this.ref.id}></div>
    },
  },
})
