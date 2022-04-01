/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {
  createComponent,
  create,
  withComponent,
  req,
  mock,
} from '@rdeco/web-app-sdk'
import { combination } from '@rdeco/core'

mock['@test/config/data-model'] = {
  begin() {
    return Promise.resolve('world')
  },
}

test('测试 Mock api', async () => {
  create({
    name: '@test/config/data-model',
    exports: {
      begin(resolve) {
        resolve('hello')
      },
    },
  })
  const Test = createComponent({
    name: 'test',
    state: {
      text: 'hello wrold',
    },
    controller: {
      onMount() {
        const dataModel = req('@test/config/data-model')
        dataModel.begin().then((res) => {
          expect(res).toBe('world')
        })
      },
    },
    view: {
      render() {
        return <div>test</div>
      },
    },
  })

  render(<Test></Test>)
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
  await p
})
