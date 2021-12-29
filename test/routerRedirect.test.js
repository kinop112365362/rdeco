import React from 'react'
import { Router, RouteView, Redirect, App } from 'rdeco/src'
import { render, waitFor } from '@testing-library/react'

describe('test <routerRedirect>', () => {
  const app = new App({
    router: [
      { name: 'a', path: '/a' },
      { name: 'b', path: '/b', forwardTo: 'a' },
    ],
    Container: {
      name: 'app-container',
      state: {
        text: 'app text',
      },
      view: {
        render() {
          return (
            <div id={'Container'}>
              {this.state.text}
              <Router>
                <RouteView path={'/home'} />
                <Redirect path={'/index'} forwardTo={'/home'} />
                <Redirect exact path={'/index2'} forwardTo={'/home'} />
              </Router>
            </div>
          )
        },
      },
    },
  })

  render(<div id="root" />)

  it('router redirect', async () => {
    await app.start('/')
    await waitFor(async () => {
      app.router.navigate('/index')
      expect(window.location.hash).toBe('#/home')
    })
  })

  it('router redirect', async () => {
    await waitFor(async () => {
      app.router.navigate('/index/xx')
      expect(window.location.hash).toBe('#/home')
    })
  })

  it('router redirect', async () => {
    await waitFor(async () => {
      app.router.navigate('/index2/xx')
      expect(window.location.hash).toBe('#/index/xx')
    })
  })
})
