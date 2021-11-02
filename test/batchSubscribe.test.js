/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createEntity, withComponent } from '../src'
import { combination } from '../src/package/@rdeco/core'

test('测试广播监听的用例', async () => {
  createEntity({
    name: '@test/entity-1',
    notification: {
      click() {
        console.debug('click')
      },
    },
  })
  createEntity({
    name: '@test/entity-2',
  })
  const Test = createComponent({
    name: '@test/com',
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

  render(<Test></Test>)
  fireEvent.click(screen.getByRole('click'))
})
