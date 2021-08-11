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
    linkable: {
      ComponentA: ['age'],
    },
    view: {
      render() {
        useEffect(() => {
          if (this.linkable.ComponentA.age !== '18') {
            expect(this.linkable.ComponentA.age).toBe('20')
          }
        }, [this.linkable.ComponentA.age])
        return <div role="age">{this.linkable.ComponentA.age}</div>
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
  await waitFor(() => {})
})
