/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { createComponent, create } from '@rdeco/web-app-sdk'
// import {scope} from '@/contanst'

createComponent({
  name: 'hello-fooo',
  view: {
    render() {
      return null
    },
  },
})
createComponent({
  name: '@scope/hello-fooo2',
  view: {
    render() {
      return null
    },
  },
})

create({
  name: '@scope/foo',
  controller: {
    onMount() {
      console.log('MYModule')
    },
  },
})
