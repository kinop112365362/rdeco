import React, { useContext, useEffect } from 'react'
import {
  render,
  fireEvent,
  waitFor,
  screen,
  getByTestId
} from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 view 的内部嵌套', async () => {
  const initState = {
    showConfirmModal: false,
    viewCtrl: {
      renderView1: false
    }
  }
  const service = {
    async openModal () {
      return 'true'
    }
  }
  const controller = {
    async onConfirmButtonClick () {
      const res = await this.service.openModal()
      this.rc.setShowConfirmModal(res)
      this.rc.setState({
        viewCtrl:{
          renderView1:true
        }
      })
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller,
    view: {
      renderView1 () {
        return <div data-testid='render'>renderView1</div>
      },
      renderView2 () {
        return <div>{this.view.renderView1()}</div>
      },
      renderView3 () {
        return <div data-testid='render3'>{this.view.renderView2()}</div>
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return <div>{store.view.renderView3()}<div role="button" onClick={store.controller.onConfirmButtonClick}></div></div>
  }
  render(<Test></Test>)
  expect(document.querySelector('[data-testid=render]')).toBeNull()
  expect(document.querySelector('[data-testid=render3]')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(document.querySelector('[data-testid=render]')).toBeInTheDocument()
  })
  
})
