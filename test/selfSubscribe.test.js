/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from '@rdeco/web-app-sdk'
import { combination } from '@rdeco/core/src'

test('测试自己监听自己', async () => {
  const Test = createComponent({
    name: '@test/com',
    state: {
      id: null,
    },
    subscribe: {
      '@test/com': {
        controller: {
          onClick() {
            this.setter.id(this.props.id)
            console.debug('click self')
          },
        },
      },
    },
    controller: {
      onClick() {
        console.debug('click')
      },
    },
    view: {
      render() {
        return (
          <div role={`click${this.props.id}`} onClick={this.controller.onClick}>
            <div role={this.props.id}>{this.state.id}</div>
          </div>
        )
      },
    },
  })

  render(
    <>
      {[1, 2].map((number) => {
        return <Test key={number} id={number}></Test>
      })}
    </>
  )
  fireEvent.click(screen.getByRole('click1'))
  await waitFor(() => {
    expect(screen.getByRole('1')).toHaveTextContent('1')
  })
})
