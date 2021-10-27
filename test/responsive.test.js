/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createComponent } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 responsive', async () => {
  const ComponentA = createComponent({
    name: '@test/component-a',
    state: {
      name: 'jacky',
      age: '18',
    },
    controller: {
      onClick() {
        this.setter.age('20')
        this.tap('setAgeOver', 20)
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
    name: '@test/component-b',
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
  const ComponentC = createComponent({
    name: '@test/component-c',
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
    notification: {
      callMe(name) {
        this.setter.callMeName(name)
      },
    },
    subscribe: {
      state: [
        [
          '@test/component-a',
          {
            name({ prevState, nextState, state }) {
              this.setter.aname(nextState)
            },
          },
        ],
      ],
      tappable: [
        [
          '@test/component-a',
          {
            setAgeOver(age) {
              this.setter.hookAge(age)
            },
          },
        ],
      ],
      controller: [
        [
          '@test/component-a',
          {
            onClick({ state }) {
              console.debug('click')
              this.setter.age(state.age)
            },
          },
        ],
        [
          '@test/component-a',
          {
            onClick({ state }) {
              this.setter.bage(state.age)
            },
          },
        ],
      ],
    },
    controller: {
      onClick() {
        this.setter.text('Hello World')
        this.tap('onClick')
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

  const ComponentD = createComponent({
    name: '@test/component-d',
    state: {
      name: 'd',
      sidName: '',
      sidHookName: '',
    },
    subscribe: {
      controller: [
        [
          '@test/component-c',
          {
            onClick() {
              this.setter.sidName('ComponentC:sid')
            },
          },
        ],
      ],
      tappable: [
        [
          '@test/component-c',
          {
            onClick() {
              this.setter.sidHookName('ComponentC:sidHook')
            },
          },
        ],
      ],
    },
    controller: {
      onClick() {
        this.setter.name(this.props.name)
        this.notify('@test/component-c', 'callMe', 'helloC')
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
            <div role="sidName">{this.state.sidName}</div>
            <div role="sidNameHook">{this.state.sidHookName}</div>
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
        <ComponentC></ComponentC>
        <ComponentD buttonRole="buttonc" name="d"></ComponentD>
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
    screen.getAllByRole('hookAge').forEach((el) => {
      expect(el).toHaveTextContent('20')
    })
  })
})
