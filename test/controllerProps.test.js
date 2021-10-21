/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createComponent } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 props 带有 sid 的渲染正确性, 有 name 没有 sid 的情况', async () => {
  const Text = createComponent({
    name: 'TextCom',
    state: {
      text: 'default',
    },
    controller: {
      async onClick() {
        const { text } = this.props
        this.setter.text(text)
      },
    },
    view: {
      render() {
        return (
          <div role={this.props.name} onClick={this.controller.onClick}>
            {this.state.text.display}
          </div>
        )
      },
    },
  })

  function Test() {
    return (
      <div>
        {[
          { name: 't1', text: { display: 't1' } },
          { name: 't2', text: { display: 't2' } },
        ].map((d) => {
          return (
            <Text sid={d.name} name={d.name} key={d.name} text={d.text}></Text>
          )
        })}
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('t1'))
  await waitFor(() => {
    expect(screen.getByRole('t1')).toHaveTextContent('t1')
  })
  fireEvent.click(screen.getByRole('t2'))
  await waitFor(() => {
    expect(screen.getByRole('t2')).toHaveTextContent('t2')
  })
})
