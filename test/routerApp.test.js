import { render } from '@testing-library/react'
import React from 'react'
import { App } from '../src'

test('测试 App start', () => {
  const app = new App({
    router: [
      { path: '/home' },
      { path: '/home1', forwardTo: '/home' },
      { path: '/:id' },
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

  expect(app.router.rootNode.children.length).toBe(3)
  expect(app.router.rootNode.children[0].name).toBe('home1')
  expect(app.router.config.forwardMap.home1).toBe('home')
  expect(app.router.rootNode.children[1].name).toBe('home')
  expect(app.router.rootNode.children[2].name).toBe(':id')
  expect(document.getElementById('Container').textContent).toBe('app text')
})
