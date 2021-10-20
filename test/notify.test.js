/* eslint-disable no-undef */
import React, { useEffect } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent } from '../src'
import { notify } from '../src/notify'
test('派生功能是否可用', async () => {
  notify(['Test1', 'loading', 'true'])
  notify(['Test1', 'syncLoading', 'true']).then((value) => {
    expect(value).toBe('是')
  })
  const Test = createComponent({
    name: 'Test1',
    state: {
      count: 0,
      loading: '',
    },
    notification: {
      loading(state) {
        this.setter.loading(state)
      },
      syncLoading(data, next) {
        next('是')
      },
    },
    derived: {
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
            <span role="count1">{this.derived.count1}</span>
            <span role="count2">{this.derived.count2}</span>
            <span role="name">{this.derived.nameFromProps}</span>
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
  fireEvent.click(screen.getByRole('loading'))
  await waitFor(() => {
    expect(screen.getByRole('loading')).toHaveTextContent('true')
  })
})
