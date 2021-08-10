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
      age: '18',
    },
    controller: {
      onClick() {
        const nextName = this.setter.name('ann')
        this.setter.age(`${nextName}:${this.state.age}`)
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
    view: {
      render() {
        const age = this.watchComponentState('ComponentA/age')
        return <div role="age">{age}</div>
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
    expect(screen.getByRole('age')).toHaveTextContent('ann:18')
  })
})
