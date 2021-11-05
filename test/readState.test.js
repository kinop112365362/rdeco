/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createEntity, withComponent } from '../src'
import { combination, readState } from '../src/package/@rdeco/core'

test('测试广播监听的用例', async () => {
  createEntity({
    name: '@test/entity-2',
  })
  createEntity({
    name: '@test/entity-1',
    notification: {
      click() {},
    },
    subscribe: {
      '@test/com': {
        controller: {
          onClick() {
            const stateList = readState('@test/com')
            console.debug(stateList)
            const stateList1 = readState('@test/com', ({ state, props }) => {
              console.debug(state, props)
            })
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
        this.notify(['@test/entity-1'], 'click')
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
