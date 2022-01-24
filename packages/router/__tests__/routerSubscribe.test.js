/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createComponent } from '@rdeco/react'
import { invoke } from '@rdeco/web-app-sdk'
import '@testing-library/jest-dom/extend-expect'

test('测试 router 响应内部 invoke', async () => {
  invoke('@@router', 'before', {
    to: 'home,',
    from: 'index',
    done: () => {
      invoke('@@router', 'after', { route: { name: 'home', path: '/home' } })
    },
  }).then((done) => {
    done && done()
  })

  const Test = createComponent({
    name: '@test/com1',
    state: {
      page: 'no router',
    },
    router: {
      before({ to, from, done }, next) {
        next(done)
      },
      after(value) {
        expect(value).toStrictEqual({
          route: { name: 'home', path: '/home' },
        })
        this.setter.page('home')
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
    expect(screen.getByRole('page')).toHaveTextContent('home')
  })
})
