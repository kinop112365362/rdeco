import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('对嵌套 state 进行 set 的时候自动 merge 旧值', async () => {
  const createStore = configCreateStore({ plugins: [] })
  const initState = {
    modal: {
      showConfirmModal: 'false',
      title: 'title'
    }
  }
  const controller = {
    onConfirmButtonClick () {
      this.rc.setModal({
        showConfirmModal: 'true'
      })
    }
  }
  const useTestStore = createStore({
    name: 'testStore1',
    initState,
    controller,
    view: {
      renderView1 () {
        return (
          <>
            <div role='renderView1'>{this.state.modal.showConfirmModal} </div>
            <div role='title'>{this.state.modal.title}</div>
          </>
        )
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>
        {store.view.renderView1()}
        <button
          role='button'
          onClick={store.controller.onConfirmButtonClick}
        ></button>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('renderView1')).toHaveTextContent('true')
    expect(screen.getByRole('title')).toHaveTextContent('title')
  })
})
