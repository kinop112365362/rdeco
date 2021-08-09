import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createComponent, createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 combination dep', async () => {
  const ComponentA = createComponent({
    name: 'ComponentA',
    state: {
      name: 'jacky',
    },
    controller: {
      onClick() {
        this.setter.name('ann')
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
      name: 'jacky',
    },
    view: {
      render() {
        const name = this.watchComponentState('ComponentB/name')
        return <div role="nameb">{name}</div>
      },
    },
  })
  function Test() {
    return (
      <div>
        <ComponentA></ComponentA>
        <ComponentB></ComponentB>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('nameb')).toHaveTextContent('jacky')
    expect(screen.getByRole('namea')).toHaveTextContent('ann')
  })
})