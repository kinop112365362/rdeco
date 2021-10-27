/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createEntity, withComponent } from '../src'

test('测试 Entity 和 组件协同工作', async () => {
  class Comopnent extends React.Component {
    constructor(props) {
      super(props)
      this.store = this.props.store
    }
    render() {
      return (
        <>
          <div role="class">{this.store.state.text}</div>
          <button role="classBtn" onClick={this.store.controller.onClick}>
            {this.store.state.btnValue}
          </button>
        </>
      )
    }
  }
  const WithComponent = withComponent(Comopnent, {
    name: '@test/class-component',
    state: {
      text: 'hoc',
      btnValue: null,
    },
    subscribe: {
      controller: [
        [
          '@test/base-button',
          {
            onLoginButtonClick() {
              this.setter.btnValue('base')
            },
          },
        ],
      ],
    },
    controller: {
      onClick() {
        this.setter.text('hoc over')
      },
    },
  })
  createEntity({
    name: '@test/login-entity',
    state: {
      result: null,
    },
    notification: {
      query(next) {
        next('done')
      },
    },
    derivate: {
      ['@test/base-button']: {
        username: (v) => v,
        password: (v) => v,
      },
    },
    subscribe: {
      controller: [
        [
          '@test/base-button',
          {
            onLoginButtonClick() {
              this.service.getLogin()
            },
          },
        ],
      ],
    },
    service: {
      getLogin() {
        const { username, password } = this.derivate['@test/base-button']
        expect(username).toBe('ann')
        expect(password).toBe(123)
        this.setter.result({
          code: 200,
          data: {
            message: 'success',
          },
        })
        expect(this.state.result).toStrictEqual({
          code: 200,
          data: {
            message: 'success',
          },
        })
      },
    },
  })
  const BaseButton = {
    name: '@test/base-button',
    state: {
      username: 'jacky',
      password: 12345,
      message: '',
    },
    subscribe: {
      state: [
        [
          '@test/login-entity',
          {
            result({ prevState, nextState, state }) {
              expect(nextState.code).toBe(200)
              this.setter.message(nextState.data.message)
            },
          },
        ],
      ],
    },
    service: {
      test() {},
    },
    controller: {
      onMount() {
        this.setter.username('ann')
        this.setter.password(123)
      },
      onLoginButtonClick() {
        this.notify('@test/login-entity', 'query').then((value) => {
          expect(value).toBe('done')
        })
      },
    },
    view: {
      render() {
        return (
          <div role="button" onClick={this.controller.onLoginButtonClick}>
            <div role="message">{this.state.message}</div>
            <WithComponent></WithComponent>
          </div>
        )
      },
    },
  }
  const Test = createComponent(BaseButton)
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('message')).toHaveTextContent('success')
    expect(screen.getByRole('class')).toHaveTextContent('hoc')
    expect(screen.getByRole('classBtn')).toHaveTextContent('base')
  })
  fireEvent.click(screen.getByRole('classBtn'))
  await waitFor(() => {
    expect(screen.getByRole('class')).toHaveTextContent('hoc over')
  })
})
