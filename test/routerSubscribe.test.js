/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createComponent, notify } from '../src/index'
import { combination } from '../src/combination'
import '@testing-library/jest-dom/extend-expect'

test('测试 router 响应内部 notify', async () => {
  notify(['@@router', 'after', { route: { name: 'page', path: '/page' } }])
  const Test = createComponent({
    name: '@test/com1',
    state: {
      page: 'no router',
    },
    router: {
      after(value) {
        expect(value).toStrictEqual({
          route: { name: 'page', path: '/page' },
        })
        this.setter.page('page')
      },
    },
    view: {
      render() {
        return (
          <div role="page">
            <button role="click" /> {this.state.page}
          </div>
        )
      },
    },
  })

  render(<Test></Test>)
  fireEvent.click(screen.getByRole('click'))
  await waitFor(() => {
    expect(screen.getByRole('page')).toHaveTextContent('page')
  })
})
