/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, Fallback, createFallback } from '@rdeco/js'
import { combination } from '@rdeco/core/src'

test('fallBack 组件的异步占位渲染', async () => {
  setTimeout(() => {
    const AsyncComponent = createComponent({
      name: 'async-component',
      view: {
        render() {
          return <div role="async"> async-component </div>
        },
      },
    })
    createFallback(['test'], AsyncComponent)
  }, 3000)

  const Test = createComponent({
    name: 'test',
    view: {
      render() {
        return (
          <div>
            <Fallback store={this}></Fallback>
            <div role="click"></div>
          </div>
        )
      },
    },
  })
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('click'))
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 4000)
  })
  await p
  expect(screen.getByRole('async')).toHaveTextContent('async-component')
})
