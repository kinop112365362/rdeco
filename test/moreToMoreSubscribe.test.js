/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from '../src'
import { combination } from '../src/package/@rdeco/core'

test('测试多实例监听多实例', async () => {
  const Switch = createComponent({
    name: '@test/switch',
    state: {
      text: null,
    },
    controller: {
      onClick() {
        this.setter.text('switch')
      },
    },
    view: {
      render() {
        return <div role="switch" onClick={this.controller.onClick}></div>
      },
    },
  })
  const Test = createComponent({
    name: '@test/com',
    state: {
      id: null,
    },
    subscribe: {
      '@test/switch': {
        state: {
          text({ nextState }) {
            console.debug(nextState)
          },
        },
      },
    },
    controller: {
      onClick() {
        console.debug('click')
      },
    },
    view: {
      render() {
        return (
          <div role={`click${this.props.id}`} onClick={this.controller.onClick}>
            <div role={this.props.id}>{this.state.id}</div>
          </div>
        )
      },
    },
  })

  render(
    <>
      <Switch></Switch>
      {[1, 2].map((number) => {
        return <Test key={number} id={number}></Test>
      })}
    </>
  )
  fireEvent.click(screen.getByRole('switch'))
  await waitFor(() => {
    // expect(screen.getByRole('1')).toHaveTextContent('1')
  })
})
