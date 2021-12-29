import React from 'react'
import { Router, RouteView, App, createComponent } from '../packages/rdeco'
import { render, waitFor } from '@testing-library/react'

describe('test <routerUrlParams>', () => {
  const app = new App({
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
                <RouteView path={'/:id'} Component={Component_1} />
                <RouteView
                  path={'/:id/text'}
                  Component={Component_2}
                />
              </Router>
            </div>
          )
        },
      },
    },
  })

  const Component_1 = createComponent({
    name: 'component_1',
    view: {
      render() {
        return <div>Component_1</div>
      },
    },
  })

  const Component_2 = createComponent({
    name: 'component_2',
    view: {
      render() {
        return <div>Component_2</div>
      },
    },
  })

  render(<div id="root" />)

  it("default path '/'", async () => {
    await app.start('/')
    const node = document.getElementById('root')
    await waitFor(async () => {
      expect(app.router.rootNode.children.length).toBe(3)
      app.router.navigate('/secondComponent/text')
      expect(app.router.rootNode.children.length).toBe(3)
      expect(node.innerHTML).toContain(
        '<div id="Container">app text<div>Component_1</div><div>Component_2</div></div>'
      )
    })
  })
})
