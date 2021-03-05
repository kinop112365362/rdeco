import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import createStore, { createStoreContext } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试对 createStore 的兼容性', async () => {
  const initState = {
    showConfirmModal: false
  }
  const service = {
    openModal: [
      'openModal',
      function openModal () {
        console.log(this, 13)
      }
    ]
  }
  const controller = {
    onConfirmButtonClick () {
      this.service.openModal()
      this.rc.setShowConfirmModal('true')
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller
  })
  function Test () {
    const store = useTestStore()
    console.log(store, 30)
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
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('true')
  )
})
test('测试对 createStoreContext 的兼容性', async () => {
  const useAppContext = createStoreContext({
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
  const useTestStore = createStore({
    initState: {},
    controller: {
      onButtonClick () {
        console.log(this, 179)
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
