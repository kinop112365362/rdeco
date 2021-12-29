/* eslint-disable no-undef */
import React from 'react'
import { render, screen } from '@testing-library/react'
import { createComponent, createMembrane } from 'rdeco/src'
import '@testing-library/jest-dom/extend-expect'

test('测试 responsive', async () => {
  const getConfig = () => {
    return {
      name: '@test/base-com',
      state: { text: 'Base' },
      view: {
        render() {
          return <div role="text"> {this.state.text} </div>
        },
      },
    }
  }
  const Test = createComponent(
    createMembrane(getConfig(), {
      name: '@test/membrane-com',
      state: {
        text: 'MembraneCom',
      },
    })
  )
  render(<Test></Test>)
  expect(screen.getByRole('text')).toHaveTextContent('Membrane')
})
