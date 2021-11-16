/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from '../src'
import { combination } from '../src/package/@rdeco/core'

test('测试动态追加 subscribe', async () => {
  create({
    name: '@test/entity-2',
    state: {
      text: 'hello world',
    },
    controller: {
      onMount() {
        this.setter.text('onMount')
        expect(this.state.text).toBe('onMount')
      },
    },
  })
  const Test = createComponent({
    name: '@test/com',
    controller: {
      onClick() {
        this.addSubscribe({
          '@test/entity-2': {
            state: {
              text({ nextState }) {
                expect(nextState).toBe('onMount')
              },
            },
          },
        })
      },
    },
    view: {
      render() {
        return <div role="click" onClick={this.controller.onClick}></div>
      },
    },
  })

  render(<Test></Test>)
  fireEvent.click(screen.getByRole('click'))
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
  await p
})