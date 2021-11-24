/* eslint-disable no-undef */
import React, { useEffect } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, invoke } from '../src'

test('测试 invoke api', async () => {
  const Test = createComponent({
    name: '@test/com1',
    state: {
      count: 0,
      loading: '',
    },
    exports: {
      loading(state) {
        this.setter.loading(state)
      },
      syncLoading(data, next) {
        next('是')
      },
    },
    derivate: {
      count1() {
        return this.state.count + 1
      },
      count2() {
        return this.state.count + 2
      },
      nameFromProps() {
        return 'hello ' + this.props.name
      },
    },
    controller: {
      onMount() {
        this.setter.count(1)
      },
    },
    view: {
      render() {
        useEffect(() => {
          this.controller.onMount()
        }, [])
        return (
          <div>
            <span role="count1">{this.derivate.count1}</span>
            <span role="count2">{this.derivate.count2}</span>
            <span role="name">{this.derivate.nameFromProps}</span>
            <span onClick={() => {}} role="loading">
              {this.state.loading}
            </span>
          </div>
        )
      },
    },
  })

  render(<Test name="jacky"></Test>)
  expect(screen.getByRole('count1')).toHaveTextContent('2')
  expect(screen.getByRole('count2')).toHaveTextContent('3')
  expect(screen.getByRole('name')).toHaveTextContent('hello jacky')
  invoke(['@test/com1'], 'loading', 'true')
  invoke(['@test/com1'], 'syncLoading', 'true').then((value) => {
    expect(value).toBe('是')
  })
  fireEvent.click(screen.getByRole('loading'))
  await waitFor(() => {
    expect(screen.getByRole('loading')).toHaveTextContent('true')
  })
})
