/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from '../packages/rdeco'
import {
  combination,
  readState,
  enhanceContext,
} from '../packages/core'
enhanceContext('context', { name: 'context' })
test('测试 readState', async () => {
  const entityStore = create({
    name: '@test/entity-2',
  })
  expect(entityStore.context.name).toBe('context')
  create({
    name: '@test/entity-1',
    exports: {
      click() {},
    },
    subscribe: {
      '@test/com': {
        controller: {
          onClick() {
            const stateList = readState('@test/com')
            const stateList1 = readState('@test/com', ({ state, props }) => {})
          },
        },
      },
    },
  })
  const Test = createComponent({
    name: '@test/com',
    state: {
      text: 'hello world',
    },
    controller: {
      onClick() {
        this.invoke(['@test/entity-1'], 'click')
      },
    },
    view: {
      render() {
        return <div role="click" onClick={this.controller.onClick}></div>
      },
    },
  })

  render(<Test id={1}></Test>)
  fireEvent.click(screen.getByRole('click'))
  await waitFor(() => {})
})
