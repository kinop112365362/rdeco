/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createEntity } from '../src'

test('测试 Entity 和 组件协同工作', async () => {
  createEntity({
    name: 'TestEntity',
    state: {
      result: null,
    },
    derivate: {
      TestCom: {
        username(value) {
          return value
        },
        password(value) {
          return value
        },
      },
    },
    subscribe: {
      controller: {
        TestCom: {
          onLoginButtonClick() {
            this.service.getLogin()
          },
        },
      },
    },
    service: {
      getLogin() {
        const { username, password } = this.derivate.TestCom
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
    name: 'TestCom',
    state: {
      username: 'jacky',
      password: 12345,
      message: '',
    },
    subscribe: {
      state: {
        TestEntity: {
          result({ prevState, nextState, state }) {
            expect(nextState.code).toBe(200)
            this.setter.message(nextState.data.message)
          },
        },
      },
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
