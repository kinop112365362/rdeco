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
  registerReactContext,
} from '../src'
import { combination } from '../src/package/@rdeco/core'

const CopyContext = registerReactContext('copy')

test('React Context 使用', async () => {
  const Test = createComponent({
    name: '@test/com',
    context: ['copy'],
    view: {
      render() {
        console.debug('render')
        return <div role="copyName">{this.context.copy.name}</div>
      },
    },
  })

  render(
    <CopyContext.Provider value={{ name: 'jacky' }}>
      <Test></Test>
    </CopyContext.Provider>
  )
  expect(screen.getByRole('copyName')).toHaveTextContent('jacky')
})
