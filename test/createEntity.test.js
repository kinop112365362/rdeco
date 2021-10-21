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
    subscribe: {
      controller: {
        Test: {
          onLoginButtonClick() {
            const { username, password } = this.derivate.Test
            this.service.getLogin()
          },
        },
      },
      derivate: {
        Test: {
          username(value) {
            return value
          },
          password(value) {
            return value
          },
        },
      },
    },
    service: {
      getLogin(username, password) {
        setTimeout(() => {
          this.setter.result({
            code: 200,
            data: {
              message: 'success',
            },
          })
        }, 2000)
      },
    },
  })
  const BaseButton = {
    name: 'Test1',
    state: {
      text: 'jacky',
    },
    ref: {
      count: 0,
    },
    controller: {
      onClick() {
        ++this.ref.count
        this.setter.text('ann')
      },
    },
    view: {
      render() {
        return (
          <div role="button" onClick={this.controller.onClick}>
            <div role="ref">{this.ref.count}</div>
            <div role="text">{this.state.text}</div>
          </div>
        )
      },
    },
  }
  const Test = createComponent(BaseButton)
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => expect(screen.getByRole('ref')).toHaveTextContent('1'))
})
