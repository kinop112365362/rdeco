import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 view 的内部嵌套', async () => {
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
      this.state.setShowConfirmModal(res)
    }
  }
  const useTestStore = createStore({
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
      renderView3(text){
        console.log(text)
        return(
          <div>{this.view.renderView2()}
          <div role='text'>{text}</div>
          </div>
        )
      }
    }
  })
  function Test () {
    const store = useTestStore()
    console.log(store, 30)
    return (
      <div>{store.view.renderView3('hello world')}</div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('text')).toHaveTextContent('hello world')
})
