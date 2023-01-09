/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createComponent, create } from '@rdeco/web-app-sdk'
import { combination } from '@rdeco/core/src'
import '@testing-library/jest-dom/extend-expect'

test('测试 unmount 组件销毁的过程', async () => {
  const Tag = createComponent({
    name: '@test/tag',
    subscribe: {
      '@test/tag': {
        state: {},
      },
    },
    controller: {
      onClick() {
        this.invoke(['@test/com'], 'notReady')
      },
    },
    view: {
      render() {
        const store = create({
          name: 'test',
          exports: {},
        })
        store.dispose()
        const store1 = create({
          name: 'test',
          exports: {},
        })
        store1.dispose()
        return (
          <div
            role={`notReady${this.props.id}`}
            onClick={this.controller.onClick}
          >
            Tag
          </div>
        )
      },
    },
  })

  const Test = createComponent({
    name: '@test/com',
    state: {
      ready: true,
    },
    exports: {
      notReady() {
        this.setter.ready(false)
      },
    },
    controller: {
      onClick() {
        this.setter.ready(false)
      },
    },
    view: {
      render() {
        return (
          <>
            {this.state.ready ? (
              <div>
                <Tag id={1} />
                <Tag />
              </div>
            ) : (
              <div>notReady</div>
            )}
          </>
        )
      },
    },
  })

  render(<Test></Test>)
  fireEvent.click(screen.getByRole('notReady1'))
  await waitFor(() => {
    expect(combination.components['@test/tag']).toStrictEqual([])
    expect(combination.subjects.targets['@test/tag']).toStrictEqual([])
    console.debug(combination.notificationSubjects)
    // expect(combination.notificationSubject['test'].observer).toStrictEqual([])
  })
})
