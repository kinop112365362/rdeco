/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import '@testing-library/jest-dom/extend-expect'
import {
  createComponent,
  create,
  withComponent,
  Inject,
  InjectComponent,
} from '@rdeco/js'
import { combination } from '@rdeco/core/src'

test('React Inject Component Test', async () => {
  const Tag = createComponent({
    name: '@test/tag',
    view: {
      render() {
        return <div role="tag">tag</div>
      },
    },
  })
  const Tag1 = createComponent({
    name: '@test/tag1',
    view: {
      render() {
        return <div role="tag1">tag1</div>
      },
    },
  })
  create({
    name: '@test/tag-module',
    exports: {
      render(el, props, Context) {
        ReactDOM.render(<Tag></Tag>, el)
      },
    },
  })
  create({
    name: '@test/tag-module1',
    exports: {
      getComponent(next) {
        next(Tag1)
      },
    },
  })
  const Test = createComponent({
    name: '@test/com',
    view: {
      render() {
        return (
          <div>
            <Inject name="@test/tag-module"></Inject>
            <InjectComponent name="@test/tag-module1"></InjectComponent>
          </div>
        )
      },
    },
  })
  const Sleep = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
  await Sleep.then()
  render(<Test></Test>)
  expect(screen.getByRole('tag')).toHaveTextContent('tag')
  // expect(screen.getByRole('tag1')).toHaveTextContent('tag1')
})
