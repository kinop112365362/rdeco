/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, enhanceContext } from 'rdeco/src'

test('运行 createComponent  基本功能测试, state → controller → service → reducer → view', async () => {
  const state = ({ showConfirmModal }) => ({
    showConfirmModal,
    array: [1, 2, 3],
  })
  const service = {
    openModal() {},
  }
  const controller = {
    onConfirmButtonClick() {
      this.service.openModal()
      this.setter.showConfirmModal('true')
      this.setter.array([0])
    },
  }
  const Test = createComponent({
    name: '@test/com1',
    state,
    service,
    controller,
    view: {
      render() {
        return (
          <div>
            <button
              role="confirm"
              onClick={this.controller.onConfirmButtonClick}
            ></button>
            <span role="showConfirmModal">{this.state.showConfirmModal}</span>
            <span role="array">{this.state.array}</span>
          </div>
        )
      },
    },
  })
  render(<Test showConfirmModal="false"></Test>)
  expect(screen.getByRole('showConfirmModal')).toHaveTextContent('false')
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() => {
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('true')
    expect(screen.getByRole('array')).toHaveTextContent(0)
  })
})
test('运行异步 service 测试', async () => {
  const state = {
    showConfirmModal: false,
  }
  const api = () =>
    new Promise((resolve) => {
      resolve('async')
    })
  const service = {
    async openModal() {
      const res = await api()
      return res
    },
  }
  const controller = {
    async onConfirmButtonClick() {
      const res = await this.service.openModal()
      this.setter.showConfirmModal(res)
    },
  }
  const Test = createComponent({
    name: '@test/com2',
    state,
    service,
    controller,
    view: {
      render() {
        return (
          <div>
            <button
              role="confirm"
              onClick={this.controller.onConfirmButtonClick}
            ></button>
            <span role="showConfirmModal">{this.state.showConfirmModal}</span>
          </div>
        )
      },
    },
  })
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() =>
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('async')
  )
})
test('运行 controller 增强模式测试, logPlugin 运行正常', async () => {
  const state = {
    showConfirmModal: false,
  }

  const api = () =>
    new Promise((resolve) => {
      resolve('async')
    })
  const service = {
    async openModal() {
      const res = await api()
      return res
    },
  }
  const controller = {
    async onConfirmButtonClick() {
      const res = await this.service.openModal()
      this.setter.showConfirmModal(res)
    },
  }
  const Test = createComponent({
    name: '@test/com3',
    state,
    service,
    controller,
    view: {
      render() {
        return (
          <div>
            <button
              role="confirm"
              onClick={this.controller.onConfirmButtonClick}
            ></button>
            <span role="showConfirmModal">{this.state.showConfirmModal}</span>
          </div>
        )
      },
    },
  })
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() =>
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('async')
  )
})
test('运行 view 模块, 测试 render 函数', async () => {
  const Test = createComponent({
    name: '@test/com4',
    state: {
      renderButton: true,
    },
    controller: {
      onButtonClick() {
        this.setter.renderButton('haha')
      },
    },
    view: {
      renderButton() {
        if (this.state.renderButton) {
          return (
            <button role="delete" onClick={this.controller.onButtonClick}>
              点我消失
            </button>
          )
        }
      },
      render() {
        return (
          <div role="renderButton">
            {this.state.renderButton}
            {this.view.renderButton()}
          </div>
        )
      },
    },
  })

  render(<Test></Test>)
  fireEvent.click(screen.getByRole('delete'))
  await waitFor(() =>
    expect(screen.getByRole('renderButton')).toHaveTextContent('haha')
  )
})
test('测试 enhancContext', async () => {
  enhanceContext('context', {
    appName: 'app',
    router: {
      navigator() {},
    },
  })
  const Test = createComponent({
    name: '@test/com5',
    state: {
      renderButton: true,
    },
    controller: {
      onButtonClick() {
        this.setter.renderButton('haha')
        expect(this.context.appName).toBe('app')
      },
    },
    view: {
      renderButton() {
        if (this.state.renderButton) {
          return (
            <button role="delete" onClick={this.controller.onButtonClick}>
              点我消失
            </button>
          )
        }
      },
      render() {
        return (
          <div role="renderButton">
            {this.state.renderButton}
            {this.view.renderButton()}
          </div>
        )
      },
    },
  })

  render(<Test></Test>)
  fireEvent.click(screen.getByRole('delete'))
  await waitFor(() =>
    expect(screen.getByRole('renderButton')).toHaveTextContent('haha')
  )
})
