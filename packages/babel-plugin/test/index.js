/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import lodash from 'lodash'
import { foo, helloFooo2 } from 'remote://hrss-component/hrss-data-model'
import { foo1, helloFooo } from 'remote://hrss-component/hrss-data-model1'
import React from 'react'
import React3 from 'react-dom'
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
