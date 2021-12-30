/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from '@rdeco/js'
import { combination } from '@rdeco/core'

test('测试广播监听的用例', async () => {
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
        this.invoke(['@test/entity-1'], 'click')
        create({
          name: '@test/entity-1',
          exports: {
            click() {},
          },
          subscribe: {
            '@test/com': {
              controller: {
                onClick() {},
              },
            },
          },
        })
      },
    },
    view: {
      render() {
        console.debug('render')
        return <div role="click" onClick={this.controller.onClick}></div>
      },
    },
  })

  render(<Test></Test>)
  fireEvent.click(screen.getByRole('click'))
})
