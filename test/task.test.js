/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {
  createComponent,
  create,
  withComponent,
  task,
  req,
} from '@rdeco/web-app-sdk'
import { combination } from '@rdeco/core'

test('测试 Task api', async () => {
  create({
    name: '@test-config/data-model',
    ref: {
      taskId: task.create(),
    },
    exports: {
      begin(resolve, reject, pending) {
        task.add(
          this.ref.taskId,
          setInterval(() => {
            console.debug(1000)
          }, 500)
        )
        pending(this.ref.taskId)
        resolve('begin')
      },
    },
  })
  const Test = createComponent({
    name: 'test',
    state: {
      text: 'hello wrold',
    },
    controller: {
      onMount() {
        const dataModel = req('@test/config/data-model')
        this.setter.text('hll', () => {
          console.debug(this.state)
        })
        dataModel
          .begin()
          .then((res) => {
            expect(res).toBe('begin')
          })
          .pending((taskId) => {
            console.debug(taskId)
            task.clear(taskId)
          })
      },
    },
    view: {
      render() {
        return <div>test</div>
      },
    },
  })

  render(<Test></Test>)
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
  await p
})
