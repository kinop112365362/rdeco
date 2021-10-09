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
      age: 0,
      bage: 0,
      aname: '',
      dname: '',
    },
    createShadowSubscribe({ componentName }) {
      if (componentName === 'ComponentD_d') {
        return {
          state({ key, prevState, nextState }) {
            console.debug(key, prevState, nextState)
          },
          controller: {
            onClick({ state }) {
              console.debug(state)

              this.setter.dname(state.name)
            },
          },
        }
      }
    },
    subscribe: {
      ComponentA: {
        state({ key, prevState, nextState }) {
          if (key === 'name') {
            this.setter.aname(nextState[key])
          }
        },
        controller: {
          onClick({ state }) {
            this.setter.age(state.age)
          },
        },
      },
      ComponentB: {
        controller: {
          onClick({ state }) {
            this.getState('ComponentB').then((state) => {})
            this.setter.bage(state.age)
          },
        },
      },
    },
    controller: {
      onClick() {
        this.setter.text('Hello World')
      },
    },
    view: {
      render() {
        return (
          <>
            <div role="age">{this.state.age}</div>
            <div role="bage">{this.state.bage}</div>
            <div role="aname">{this.state.aname}</div>
            <div role="dname">{this.state.dname}</div>
            <button
              role={this.props.sid ? `c${this.props.sid}` : `c`}
              onClick={this.controller.onClick}
            ></button>
          </>
        )
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
      name: 'ann',
      ctext: '',
      age: 0,
    },
    controller: {
      onClick() {
        this.setter.age(19)
      },
    },
    view: {
      render() {
        return (
          <div>
            <div role="name">{this.state.name}</div>
            <button role="buttonb" onClick={this.controller.onClick}></button>
            <div role="ctext">{this.state.ctext}</div>
          </div>
        )
      },
    },
  })
  const ComponentD = createComponent({
    name: 'ComponentD',
    state: {
      name: 'd',
    },
    controller: {
      onClick() {
        console.debug('click')
        this.setter.name('dddd')
      },
    },
    view: {
      render() {
        return (
          <>
            <button role="buttonc" onClick={this.controller.onClick}></button>
            <div>{this.state.name}</div>
          </>
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
        <ComponentD sid="d"></ComponentD>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('buttonb'))
  fireEvent.click(screen.getByRole('buttonc'))
  await waitFor(() => {
    expect(screen.getByRole('age')).toHaveTextContent('20')
    expect(screen.getByRole('bage')).toHaveTextContent('19')
    expect(screen.getByRole('aname')).toHaveTextContent('ann')
    expect(screen.getByRole('dname')).toHaveTextContent('dddd')
  })
})
