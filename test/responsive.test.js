/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createComponent } from '../src/index'
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
      dNextName: '',
      hookAge: '',
      callMeName: '',
    },
    createShadowSubscribe({ componentName }) {
      if (componentName === 'ComponentD') {
        return {
          // eslint-disable-next-line no-unused-vars
          state({ key, prevState, nextState }) {
            this.setter.dNextName(nextState.name)
          },
          controller: {
            onClick({ state }) {
              this.setter.dname(state.name)
            },
          },
        }
      }
    },
    proxySubscribe: {
      callMe(name) {
        this.setter.callMeName(name)
      },
    },
    subscribe: {
      ComponentA: {
        hooks: {
          setAgeOver(age) {
            this.setter.hookAge(age)
          },
        },
        // eslint-disable-next-line no-unused-vars
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
            <div role="aname"> aname {this.state.aname}</div>
            <div role="dname">{this.state.dname}</div>
            <div role="dNextname">{this.state.dNextName}</div>
            <div role="hookAge">{this.state.hookAge}</div>
            <div role="callMeName">{this.state.callMeName}</div>
            name: {this.name}
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
        this.hooks('setAgeOver', 20)
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
        this.notify(
          ['ComponentC', 'callMe', 'helloC'],
          ['ComponentC_cc', 'callMe', 'helloC']
        )
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
        CC
        <CComponentC sid="cc"></CComponentC>
        CC
        <ComponentC></ComponentC>
        <ComponentD buttonRole="buttonc" name="d"></ComponentD>
        <ComponentD buttonRole="buttond" name="ddd"></ComponentD>
        <ComponentD buttonRole="buttone" name="eee"></ComponentD>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('buttonb'))
  fireEvent.click(screen.getByRole('buttonc'))
  await waitFor(() => {
    screen.getAllByRole('age').forEach((el) => {
      expect(el).toHaveTextContent('18')
    })
    screen.getAllByRole('callMeName').forEach((el) => {
      expect(el).toHaveTextContent('helloC')
    })
    screen.getAllByRole('bage').forEach((el) => {
      expect(el).toHaveTextContent('0')
    })
    screen.getAllByRole('aname').forEach((el) => {
      expect(el).toHaveTextContent('ann')
    })
    screen.getAllByRole('dname').forEach((el) => {
      expect(el).toHaveTextContent('d')
    })
    screen.getAllByRole('hookAge').forEach((el) => {
      expect(el).toHaveTextContent('20')
    })
  })
  fireEvent.click(screen.getByRole('buttond'))
  await waitFor(() => {
    screen.getAllByRole('dname').forEach((el) => {
      expect(el).toHaveTextContent('d')
    })
    screen.getAllByRole('dNextname').forEach((el) => {
      expect(el).toHaveTextContent('ddd')
    })
  })
})
