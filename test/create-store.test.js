import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createStore } from '../src'

test('运行 createStore  基本功能测试, initState → controller → service → reducer → view', async () => {
  const initState = {
    showConfirmModal: false,
    array: [1, 2, 3]
  }
  const service = {
    openModal () {}
  }
  const controller = {
    onConfirmButtonClick () {
      this.service.openModal()
      this.state.setShowConfirmModal('true')
      this.state.setArray([0])
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>
        <button
          role='confirm'
          onClick={store.controller.onConfirmButtonClick}
        ></button>
        <span role='showConfirmModal'>{store.state.showConfirmModal}</span>
        <span role='array'>{store.state.array}</span>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() => {
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('true')
    expect(screen.getByRole('array')).toHaveTextContent(0)
  })
})
test('运行异步 service 测试', async () => {
  const initState = {
    showConfirmModal: false
  }
  const api = () =>
    new Promise(resolve => {
      resolve('async')
    })
  const service = {
    async openModal () {
      const res = await api()
      return res
    }
  }
  const controller = {
    async onConfirmButtonClick () {
      const res = await this.service.openModal()
      this.state.setShowConfirmModal(res)
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>
        <button
          role='confirm'
          onClick={store.controller.onConfirmButtonClick}
        ></button>
        <span role='showConfirmModal'>{store.state.showConfirmModal}</span>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() =>
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('async')
  )
})
test('运行 controller 增强模式测试, logPlugin 运行正常', async () => {
  const initState = {
    showConfirmModal: false
  }

  const api = () =>
    new Promise(resolve => {
      resolve('async')
    })
  const service = {
    async openModal () {
      const res = await api()
      return res
    }
  }
  const controller = {
    async onConfirmButtonClick () {
      const res = await this.service.openModal()
      this.state.setShowConfirmModal(res)
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>
        <button
          role='confirm'
          onClick={store.controller.onConfirmButtonClick}
        ></button>
        <span role='showConfirmModal'>{store.state.showConfirmModal}</span>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() =>
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('async')
  )
})
test('测试 Context 在 store 中的使用', async () => {
  const useAppContext = createStore({
    initState: {
      global: 'global'
    },
    controller: {
      onGlobalSet () {
        this.state.setGlobal('helloWorld')
      }
    }
  })
  function App () {
    const appStore = useAppContext()
    return (
      <AppContext.Provider value={appStore}>
        <Test></Test>
      </AppContext.Provider>
    )
  }
  const useTestStore = createStore({
    initState: {},
    controller: {
      onButtonClick () {
        this.context.controller.onGlobalSet()
      }
    }
  })
  function Test () {
    const appStore = useContext(AppContext)
    const store = useTestStore()
    return (
      <div role='global'>
        <button role='button' onClick={store.controller.onButtonClick}></button>
        {appStore.state.global}
      </div>
    )
  }
  render(<App></App>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() =>
    expect(screen.getByRole('global')).toHaveTextContent('helloWorld')
  )
})
test('运行 view 模块, 测试 render 函数', async () => {
  const useTestStore = createStore({
    initState: {
      renderButton: true
    },
    view: {
      renderButton () {
        if (this.state.renderButton) {
          return (
            <button role='delete' onClick={this.controller.onButtonClick}>
              点我消失
            </button>
          )
        }
      }
    },
    controller: {
      onButtonClick () {
        this.state.setRenderButton('haha')
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return (
      <div role='renderButton'>
        {store.state.renderButton}
        {store.view.renderButton()}
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('delete'))
  await waitFor(() =>
    expect(screen.getByRole('renderButton')).toHaveTextContent('haha')
  )
})
test('测试单独的 rc.set, 可以联动其他的 rc 可以获取前置的 state', async () => {
  const initState = {
    count: 0
  }
  const service = {}
  const controller = {
    onComponentInit () {
      this.state.setCount(prevCount => ++prevCount)
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller
  })
  function Test () {
    const store = useTestStore()
    useEffect(() => {
      store.controller.onComponentInit()
    }, [])
    return (
      <div>
        <span role='msg'>{store.state.count}</span>
      </div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('msg')).toHaveTextContent('1')
})
