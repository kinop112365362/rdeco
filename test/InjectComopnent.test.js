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
} from '@rdeco/web-app-sdk'
import { combination } from '@rdeco/core/src'

test('React Inject Component Test', async () => {
  // const Tag = createComponent({
  //   name: '@test/tag',
  //   view: {
  //     render() {
  //       return <div role="tag">tag</div>
  //     },
  //   },
  // })
  const Tag1 = createComponent({
    name: '@test/tag1',
    view: {
      render() {
        return <div role="tag1">tag1</div>
      },
    },
  })
  // create({
  //   name: '@test/tag-module',
  //   exports: {
  //     render(el, props, Context) {
  //       ReactDOM.render(<Tag></Tag>, el)
  //     },
  //   },
  // })
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
    state: {
      id: 0,
      params: {
        onSuccess() {
          this.setter.id(1)
        },
      },
    },
    controller: {
      onClick,
    },
    view: {
      render() {
        return (
          <div>
            <InjectComponent
              name="@test/tag-module1"
              id={this.state.id}
            ></InjectComponent>
            <div role="id">{this.state.id}</div>
            <button role="button" onClick={this.controller.onClick}></button>
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
  render(<Test></Test>)
  await Sleep.then()
  expect(screen.getByRole('tag1')).toHaveTextContent('tag1')
})
