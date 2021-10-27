import { render } from '@testing-library/react'
import React from 'react'
import { App } from '../src'

test('测试 App start', () => {
  const app = new App({
    router: [
      {
        name: 'home',
        path: '/',
      },
    ],
    Container: {
      name: 'app-container',
      state: {
        text: 'app text',
      },
      view: {
        render() {
          return <div id={'Container'}>{this.state.text}</div>
        },
      },
    },
  })
  render(<div id="root" />)
  app.start()

  expect(document.getElementById('Container').textContent).toBe('app text')
})
