import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 configCreateStore', async () => {
  const createStore = configCreateStore({plugins:[]})
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
