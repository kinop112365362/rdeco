/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from '@rdeco/js'
import { combination } from '@rdeco/core/src'

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
      hide: true,
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
      onUnmount() {
        console.log('onUnmount')
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
  function App() {
    const [hide, setHide] = useState(true)

    return (
      <div role="hide" onClick={() => setHide(false)}>
        <Switch></Switch>
        {hide &&
          [1, 2].map((number) => {
            return <Test key={number} id={number}></Test>
          })}
      </div>
    )
  }

  render(<App></App>)
  fireEvent.click(screen.getByRole('hide'))
  await waitFor(() => {
    expect(
      combination.subjects.targets['@test/switch'][0].subjects.state.observers
    ).toStrictEqual([])
  })
})
