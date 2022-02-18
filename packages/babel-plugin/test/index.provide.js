/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { createComponent, create } from '@rdeco/web-app-sdk'

createComponent({
  name: 'helloFooo',
  view: {
    render() {
      return null
    },
  },
})
createComponent({
  name: 'helloFooo2',
  view: {
    render() {
      return null
    },
  },
})

create({
  name: 'foo',
  controller: {
    onMount() {
      console.log('MYModule')
    },
  },
})
