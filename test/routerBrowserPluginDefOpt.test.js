import { App, Router } from '../packages/router5'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

describe('test <RouteView> browserPlugin default options', () => {
  const app = new App({
    router: [
      {
        name: 'home',
        path: '/home',
      },
    ],
    Container: {
      name: 'app-container',
      state: {
        text: 'app text',
      },
      view: {
        render() {
          return (
            <Router path={'/home'} id={'Container'}>
              {this.state.text}
            </Router>
          )
        },
      },
    },
  })
  render(<div id="root" />)
  app.start('/home')
  it('router browserPlugin useHash true', async () => {
    await waitFor(() => {
      expect(window.location.href).toContain('http://localhost/#/home')
    })
  })
})
