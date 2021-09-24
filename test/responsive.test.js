import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createComponent, createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 responsive', async () => {
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
      clickLog: '',
    },
    subscribe: {
      ComponentA: {
        state: {
          age(data) {
            this.setter.name(`jacky's age is ${data.nextValue}`)
          },
        },
        controller: {
          onClick(data) {
            this.setter.clickLog('componentA be onClick')
          },
        },
      },
    },
    view: {
      render() {
        return (
          <div>
            <div role="name">{this.state.name}</div>
            <div role="clickLog">{this.state.clickLog}</div>
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
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('name')).toHaveTextContent("jacky's age is 20")
    expect(screen.getByRole('clickLog')).toHaveTextContent(
      'componentA be onClick'
    )
  })
})
