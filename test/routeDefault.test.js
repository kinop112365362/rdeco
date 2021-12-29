import React from 'react'
import { RouteView, Router, App, createComponent } from '../packages/rdeco'
import { render, waitFor } from '@testing-library/react'

describe('test <RouteView>', () => {
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
  const SecondComponent = createComponent({
    name: 'second-component',
    view: {
      render() {
        return <div id={'secondComponent'}>sub Component com1</div>
      },
    },
  })
  const ThreeComponent = createComponent({
    name: 'three-component',
    view: {
      render() {
        return <div>ThreeComponent</div>
      },
    },
  })
  const SecondComponentChild = createComponent({
    name: 'second-component-child',
    view: {
      render() {
        return (
          <div>
            <div>secondComponentChild</div>
            <RouteView path={'/threeComponent'}>
              <ThreeComponent />
            </RouteView>
            <RouteView path={'/threeComponent1'}>
              <ThreeComponent />
            </RouteView>
          </div>
        )
      },
    },
  })
  const BaseComponent = createComponent({
    name: 'base-com',
    state: {
      com2Text: 'com2 text',
    },
    router: {
      before({ toState }) {
        console.log(toState)

        expect(toState.params).toMatchObject({
          a: 1,
          b: 2,
        })
      },
      after({ state }) {
        expect(state.params).toMatchObject({
          a: 1,
          b: 2,
        })
      },
    },
    controller: {
      onChangeRouter() {
        this.context.router.navigate('/secondComponent')
      },
    },
    view: {
      render() {
        return (
          <Router>
            <div>
              <button role="button" onClick={this.controller.onChangeRouter}>
                button
              </button>
              <RouteView
                path={'/secondComponent'}
                Component={SecondComponent}
              />
              <RouteView
                path={'/secondComponent'}
                Component={() => <div>com2</div>}
              >
                <div>{this.state.com2Text}</div>
                <RouteView
                  path={'/threeComponent'}
                  Component={ThreeComponent}
                />
              </RouteView>
              <RouteView
                path={'/secondComponentChild'}
                Component={SecondComponentChild}
              />
            </div>
          </Router>
        )
      },
    },
  })

  beforeEach(() => {
    if (app.router.isStarted()) {
      app.router.stop()
    }
    render(<div id="root" />)
  })

  it("default path '/secondComponentChild/threeComponent?a=1&b=2'", async () => {
    app.start('/secondComponentChild/threeComponent?a=1&b=2')
    const node = document.getElementById('Container')

    render(<BaseComponent />, {
      container: node,
    })

    await waitFor(() => {
      expect(node.innerHTML).toContain(
        '<div><button role="button">button</button><div><div>secondComponentChild</div><div>ThreeComponent</div></div></div>'
      )
    })
  })
})
