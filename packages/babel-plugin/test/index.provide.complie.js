/* eslint-disable import/no-unresolved */

/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
import { createComponent, create } from '@rdeco/web-app-sdk'
createComponent({
  name: '@hrss-component-hrss-data-model/hello-fooo',
  view: {
    render() {
      return null
    },
  },
})
createComponent({
  name: '@hrss-component-hrss-data-model/hello-fooo-2',
  view: {
    render() {
      return null
    },
  },
})
create({
  name: '@hrss-component-hrss-data-model/foo',
  controller: {
    onMount() {
      console.log('MYModule')
    },
  },
})
