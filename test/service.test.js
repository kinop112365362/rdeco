import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 async service', async () => {
  const createStore = configCreateStore({plugins:[]})
  const initState = {
    showConfirmModal: false
  }
  const service = {
    async openModal(){
      return 'true'
    }
  }
  const controller = {
    async onConfirmButtonClick () {
      const res = await this.service.openModal()
      this.rc.setShowConfirmModal(res)
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
