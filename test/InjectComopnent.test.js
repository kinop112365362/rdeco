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
        return (
          <div role="tag1">
            tag1 <div role="id">{this.props.params.id}</div>{' '}
          </div>
        )
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
      params: {
        id: 0,
      },
    },
    controller: {
      onMount() {
        this.setter.params({
          id: 1,
        })
      },
    },
    view: {
      render() {
        return (
          <div>
            <InjectComponent
              name="@test/tag-module1"
              params={this.state.params}
            ></InjectComponent>
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
  expect(screen.getByRole('id')).toHaveTextContent('1')
})
