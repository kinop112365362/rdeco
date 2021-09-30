import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createComponent, createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 godSubscribe', async () => {
  const ComponentC = createComponent({
    name: 'ComponentC',
    state: {
      text: '',
      age: 0,
      bage: 0,
      aname: '',
      dname: '',
    },
    godSubscribe: {
      view({ name, key }) {
        if (name === 'ComponentB' && key === 'render') {
          const info = `${name}_${key}`
          expect(info).toBe('ComonentB_render')
        }
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
            <button role="c" onClick={this.controller.onClick}></button>
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
})
