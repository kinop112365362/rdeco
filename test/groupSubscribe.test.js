/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent } from 'rdeco/src'
import { combination } from '@rdeco/core/src'

test('测试分组监听的正确性', async () => {
  const Tag = createComponent({
    name: '@test/tag',
    controller: {
      onClick() {
        this.emit('selectChange', this.props.id)
      },
    },
    view: {
      render() {
        return (
          <div role={`tag${this.props.id}`} onClick={this.controller.onClick}>
            {' '}
            tag{' '}
          </div>
        )
      },
    },
  })
  const Test = createComponent({
    name: '@test/com',
    subscribe: {
      '@test/tag': {
        event: {
          selectChange(id, props) {},
        },
      },
    },
    controller: {
      onClick() {},
    },
    view: {
      render() {
        return <div>{this.props.children}</div>
      },
    },
  })

  render(
    <Test>
      <Tag></Tag>
      <Tag id={1} channel="quick"></Tag>
      <Tag id={2}></Tag>
      <Tag id={3} channel="quick"></Tag>
      <Tag id={4}></Tag>
      <Tag id={5}></Tag>
    </Test>
  )
  fireEvent.click(screen.getByRole('tagundefined'))
  fireEvent.click(screen.getByRole('tag1'))
  fireEvent.click(screen.getByRole('tag2'))
  fireEvent.click(screen.getByRole('tag3'))
  fireEvent.click(screen.getByRole('tag4'))
})
