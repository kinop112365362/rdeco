/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from '@rdeco/web-app-sdk'
import { combination } from '@rdeco/core/src'

test('测试通过 props 传递 Membrane', async () => {
  create({
    name: '@test/entity',
    subscribe: {
      '@test/com-membrane': {
        controller: {
          onClick() {
            console.debug('click')
            expect(1).toBe(1)
          },
        },
      },
    },
  })
  const Test = createComponent({
    name: '@test/com',
    controller: {},
    view: {
      render() {
        return <div role="click" onClick={this.controller.onClick}></div>
      },
    },
  })
  render(
    <Test
      membrane={{
        name: '@test/com-membrane',
      }}
    ></Test>
  )
  fireEvent.click(screen.getByRole('click'))
})
