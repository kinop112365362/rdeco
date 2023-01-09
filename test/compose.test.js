import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { createComponent, compose, createCompose } from '@rdeco/web-app-sdk'

test('测试 compose', async () => {
  const head = createCompose({
    state: {
      headText: 'head',
    },
    controller: {
      onHeadMount() {},
    },
    view: {
      renderHead() {
        return <div role="headText">{this.state.headText}</div>
      },
    },
  })
  const Test = createComponent(
    compose(
      {
        name: 'test',
        state: {
          text: 'test',
        },
        view: {
          render() {
            return (
              <div>
                {this.state.text} <div>{this.view.renderHead()}</div>
              </div>
            )
          },
        },
      },
      [head]
    )
  )
  render(<Test></Test>)
  expect(screen.getByRole('headText')).toHaveTextContent('head')
})
