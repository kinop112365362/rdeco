/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent } from '../packages/rdeco'

test('测试 ref 有效性', async () => {
  const BaseButton = {
    name: '@test/com1',
    state: {
      text: 'jacky',
    },
    ref: {
      count: 0,
    },
    controller: {
      onClick() {
        ++this.ref.count
        this.setter.text('ann')
      },
    },
    view: {
      render() {
        return (
          <div role="button" onClick={this.controller.onClick}>
            <div role="ref">{this.ref.count}</div>
            <div role="text">{this.state.text}</div>
          </div>
        )
      },
    },
  }
  const Test = createComponent(BaseButton)
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => expect(screen.getByRole('ref')).toHaveTextContent('1'))
})
