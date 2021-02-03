import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 view 的内部嵌套', async () => {
  const createStore = configCreateStore({plugins:[]})
  const initState = {
    showConfirmModal: false,
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
    name: 'testStore1',
    initState,
    service,
    controller,
    view:{
      renderView1(){
        return(
          <div role="renderView1">renderView1</div>
        )
      },
      renderView2(){
        return(
          <div>{this.view.renderView1()}</div>
        )
      },
      renderView3(){
        return(
          <div>{this.view.renderView2()}</div>
        )
      }
    }
  })
  function Test () {
    const store = useTestStore()
    console.log(store, 30)
    return (
      <div>{store.view.renderView3()}</div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('renderView1')).toHaveTextContent('renderView1')
})
