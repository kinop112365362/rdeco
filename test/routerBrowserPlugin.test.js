import { App, Router, RouteView } from '../src/package/@rdeco/router5'
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
    routerConfig: {
      browserPluginOption: {
        useHash: false,
      },
    },
    Container: {
      name: 'app-container',
      state: {
        text: 'app text',
      },
      view: {
        render() {
          return <RouteView id={'Container'}>{this.state.text}</RouteView>
        },
      },
    },
  })
  render(<div id="root" />)
  app.start('/home')
  it('router browserPlugin useHash false', async () => {
    await waitFor(() => {
      expect(window.location.href).toContain('http://localhost/home')
    })
  })
})
