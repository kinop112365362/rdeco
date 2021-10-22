/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createEntity } from '../src'

test('测试 Entity 和 组件协同工作', async () => {
  createEntity({
    name: '@test/login-entity',
    state: {
      result: null,
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
      onLoginButtonClick() {},
    },
    view: {
      render() {
        return (
          <div role="button" onClick={this.controller.onLoginButtonClick}>
            <div role="message">{this.state.message}</div>
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
  })
})
