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
      if (componentName === 'ComponentD') {
        return {
          state({ key, prevState, nextState }) {},
          controller: {
            onClick({ state }) {
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
    subscribe() {
      return {
        ComponentB: {
          state() {},
        },
      }
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
        this.setter.name(this.props.name)
      },
    },
    view: {
      render() {
        return (
          <>
            <button
              role={this.props.buttonRole}
              onClick={this.controller.onClick}
            ></button>
            <div>{this.state.name}</div>
          </>
        )
      },
    },
  })
  const CComponentC = (props) => {
    return <ComponentC {...props} />
  }
  function Test() {
    return (
      <div>
        <ComponentB></ComponentB>
        <ComponentA></ComponentA>
        <CComponentC></CComponentC>
        <ComponentC></ComponentC>
        <ComponentD buttonRole="buttonc" name="dddd"></ComponentD>
        <ComponentD buttonRole="buttond" name="ddd"></ComponentD>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('buttonb'))
  fireEvent.click(screen.getByRole('buttonc'))
  await waitFor(() => {
    screen.getAllByRole('age').forEach((el) => {
      expect(el).toHaveTextContent('20')
    })
    screen.getAllByRole('bage').forEach((el) => {
      expect(el).toHaveTextContent('19')
    })
    screen.getAllByRole('aname').forEach((el) => {
      expect(el).toHaveTextContent('ann')
    })
    screen.getAllByRole('dname').forEach((el) => {
      expect(el).toHaveTextContent('dddd')
    })
  })
  fireEvent.click(screen.getByRole('buttond'))
  await waitFor(() => {
    screen.getAllByRole('dname').forEach((el) => {
      expect(el).toHaveTextContent('ddd')
    })
  })
})
