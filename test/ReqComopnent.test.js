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
  createReqComponent,
  create,
  withComponent,
  ReqComponent,
  ReqApp,
  topInject,
} from '@rdeco/web-app-sdk'
import { combination } from '@rdeco/core/src'

window.__GALAXY_CONFIG_ENV__ = {
  envName: 'dev',
  subEnvName: 'servyou-dev',
}
create({
  name: 'top',
  exports: {
    get() {
      console.debug('top inject')
    },
  },
})
topInject('top').get()
create({
  name: 'testConfig',
  exports: {
    getBaseConfig(resolve) {
      resolve({
        component: {
          'test-inject': {
            view: {
              render() {
                return <div></div>
              },
            },
          },
        },
        function: {
          'test-function': {
            service: {
              sayHi() {},
            },
          },
        },
      })
    },
  },
})
test('React Inject Component Test', async () => {
  const Tag1 = createReqComponent({
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
  const Tag2 = create({
    name: '@test/tag2',
    exports: {
      getComponent(resolve) {
        resolve({
          default: () => {
            return <div role="tag2">tag2</div>
          },
        })
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
            <ReqComponent
              fallback={<div>loading ...</div>}
              name="@test/tag1"
              params={this.state.params}
              autoEntry
            ></ReqComponent>
            <ReqComponent
              fallback={<div>loading ...</div>}
              name="@test/tag2"
              params={this.state.params}
            ></ReqComponent>
            <ReqApp
              src="./index.html"
              membrane={{}}
              configName="testConfig"
            ></ReqApp>
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
  expect(screen.getByRole('tag2')).toHaveTextContent('tag2')
  expect(screen.getByRole('id')).toHaveTextContent('1')
})
