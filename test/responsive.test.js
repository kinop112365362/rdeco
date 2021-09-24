import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createComponent, createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 responsive', async () => {
  const ComponentC = createComponent({
    name: 'ComponentC',
    state: {
      text: '',
    },
    controller: {
      onClick() {
        this.setter.text('Hello World')
      },
    },
    view: {
      render() {
        return <button role="c" onClick={this.controller.onClick}></button>
      },
    },
  })
  const ComponentA = createComponent({
    name: 'ComponentA',
    state: {
      name: 'jacky',
      age: '18',
    },
    controller: {
      onClick() {
        this.setter.age('20')
      },
    },
    view: {
      render() {
        return (
          <div role="namea">
            {this.state.name}
            <button role="button" onClick={this.controller.onClick}></button>
          </div>
        )
      },
    },
  })
  const ComponentB = createComponent({
    name: 'ComponentB',
    state: {
      name: 'ann',
      ctext: '',
    },
    subscribe: {
      ComponentA({ lastState, nextState }) {
        this.setter.name(`jacky's age is ${nextState.age}`)
      },
      ComponentC({ nextState }) {
        console.debug(nextState)
        this.setter.ctext(nextState.text)
      },
    },
    view: {
      render() {
        return (
          <div>
            <div role="name">{this.state.name}</div>
            <div role="ctext">{this.state.ctext}</div>
          </div>
        )
      },
    },
  })
  function Test() {
    return (
      <div>
        <ComponentB></ComponentB>
        <ComponentA></ComponentA>
        <ComponentC></ComponentC>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('name')).toHaveTextContent("jacky's age is 20")
  })
  fireEvent.click(screen.getByRole('c'))
  await waitFor(() => {
    expect(screen.getByRole('ctext')).toHaveTextContent('Hello World')
  })
})
