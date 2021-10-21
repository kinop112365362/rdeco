/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createComponent } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 responsive', async () => {
  const ComponentC = createComponent({
    name: 'ComponentCCom',
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
      state: {
        ComponentACom: {
          name({ prevState, nextState, state }) {
            this.setter.aname(nextState)
          },
        },
      },
      tappable: {
        ComponentACom: {
          setAgeOver(age) {
            this.setter.hookAge(age)
          },
        },
      },
      controller: {
        ComponentACom: {
          onClick({ state }) {
            this.setter.age(state.age)
          },
        },
        ComponentBCom: {
          onClick({ state }) {
            this.setter.bage(state.age)
          },
        },
      },
    },
    controller: {
      onClick() {
        this.setter.text('Hello World')
        this.tappable('onClick')
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
    name: 'ComponentACom',
    state: {
      name: 'jacky',
      age: '18',
    },
    controller: {
      onClick() {
        this.setter.age('20')
        this.tappable('setAgeOver', 20)
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
    name: 'ComponentBCom',
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
    name: 'ComponentDCom',
    state: {
      name: 'd',
      sidName: '',
      sidHookName: '',
    },
    subscribe: {
      controller: {
        ComponentCCom: {
          onClick() {
            this.setter.sidName('ComponentC:sid')
          },
        },
      },
      tappable: {
        ComponentCCom: {
          onClick() {
            this.setter.sidHookName('ComponentC:sidHook')
          },
        },
      },
    },
    controller: {
      onClick() {
        this.setter.name(this.props.name)
        this.notify('ComponentCCom', 'callMe', 'helloC')
        this.notify('ComponentCCom_cc', 'callMe', 'helloC')
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
        CC
        <CComponentC sid="cc"></CComponentC>
        CC
        <ComponentC></ComponentC>
        <ComponentD buttonRole="buttonc" name="d"></ComponentD>
        <ComponentD sid="d" buttonRole="buttond" name="ddd"></ComponentD>
        <ComponentD sid="e" buttonRole="buttone" name="eee"></ComponentD>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('buttonb'))
  fireEvent.click(screen.getByRole('buttonc'))
  fireEvent.click(screen.getByRole('ccc'))
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
    screen.getAllByRole('sidName').forEach((el) => {
      expect(el).toHaveTextContent('ComponentC:sid')
    })
    screen.getAllByRole('sidNameHook').forEach((el) => {
      expect(el).toHaveTextContent('ComponentC:sidHook')
    })
  })
})
