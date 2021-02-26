import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createStoreHook } from '../src/core/create-store-hook'
import { AppContext } from '../src/core/app-context'
import '@testing-library/jest-dom/extend-expect'

test('运行 createStore  基本功能测试, initState → controller → service → reducer → view', async () => {
  const initState = {
    showConfirmModal: false,
    array: [1, 2, 3]
  }
  const service = {
    openModal: [
      'openModal',
      function openModal () {
      }
    ]
  }
  const controller = {
    onConfirmButtonClick () {
      this.service.openModal()
      this.rc.setShowConfirmModal('true')
      this.rc.setArray([0])
    }
  }
  const useTestStore = createStoreHook.main({
    name: 'testStore1',
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
      this.rc.setShowConfirmModal(res)
    }
  }
  const useTestStore = createStoreHook.main({
    name: 'testStore2',
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
  const initState = [
    {
      showConfirmModal: false
    },
    function init (state) {
      return state
    }
  ]
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
    onConfirmButtonClick: [
      '用户点击了确认按钮',
      async function onConfirmButtonClick () {
        const res = await this.service.openModal()
        this.rc.setShowConfirmModal(res)
      }
    ]
  }
  const useTestStore = createStoreHook.main({
    name: 'testStore5',
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
test('rc.setState()做 state 声明检查', async () => {
  const initState = {
    count: 0,
    errMessage: ''
  }
  const service = {}
  const controller = {
    onConfirmButtonClick () {
      try {
        this.rc.setState({
          ghostCount: 1,
          ghostCount2: 2,
          ghostCount3: 3
        })
      } catch (e) {
        this.rc.setErrMessage(e.message)
      }
    }
  }
  const useTestStore = createStoreHook.main({
    name: 'testStore4',
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
        <span role='showConfirmModal'>{store.state.errMessage}</span>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() =>
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent(
      '不存在的 state => [ghostCount,ghostCount2,ghostCount3], 请确保setState中更新的state在initState中已经声明'
    )
  )
})
test('rc.setState()做 state 声明检查', async () => {
  const initState = {
    count: 0,
    errMessage: ''
  }
  const service = {}
  const controller = {
    onConfirmButtonClick () {
      try {
        this.rc.setState({
          ghostCount: 1,
          ghostCount2: 2,
          ghostCount3: 3
        })
      } catch (e) {
        this.rc.setErrMessage(e.message)
      }
    }
  }
  const useTestStore = createStoreHook.main({
    name: 'testStore4',
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
        <span role='showConfirmModal'>{store.state.errMessage}</span>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() =>
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent(
      '不存在的 state => [ghostCount,ghostCount2,ghostCount3], 请确保setState中更新的state在initState中已经声明'
    )
  )
})
test('测试 Context 在 store 中的使用', async () => {
  const useAppContext = createStoreHook.main({
    initState: {
      global: 'global'
    },
    controller: {
      onGlobalSet () {
        this.rc.setGlobal('helloWorld')
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
  const useTestStore = createStoreHook.main({
    name: 'testStore5',
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
  const useTestStore = createStoreHook.main({
    name: 'testStore',
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
        this.rc.setRenderButton('haha')
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
test('测试 rc.setState 可以获取前置的 state', async () => {
  const initState = {
    count: 0,
    msg: ''
  }
  const service = {}
  const controller = {
    onComponentInit () {
      this.rc.setState(prevState => {
        if (prevState.count === 0) {
          return {
            msg: 'count 是 0'
          }
        }
      })
    }
  }
  const useTestStore = createStoreHook.main({
    name: 'testStore7',
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
        <span role='msg'>{store.state.msg}</span>
      </div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('msg')).toHaveTextContent('count 是 0')
})
test('测试单独的 rc.set, 可以联动其他的 rc 可以获取前置的 state', async () => {
  const initState = {
    count: 0
  }
  const service = {}
  const controller = {
    onComponentInit () {
      this.rc.setCount(prevCount => ++prevCount)
    }
  }
  const useTestStore = createStoreHook.main({
    name: 'testStore7',
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
