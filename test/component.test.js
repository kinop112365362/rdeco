import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

function createComponent(membrane = {controller:{}}){
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
    initState,
    service,
    controller,
    view:{
      renderView1(){
        return(
          <div role="renderView1">{this.view.renderView2()}</div>
        )
      },
      renderView2(){
        return(
          <div role="renderView2">{this.view.renderView3()}</div>
        )
      },
      renderView3(){
        return(
          <div role="renderView3">renderView3</div>
        )
      },
    },
    membrane
  })
  function Test () {
    const store = useTestStore()
    console.log(store.view.renderView2, 49)
    return (
      <div>{store.view.renderView1()}</div>
    )
  }
  return Test
}

test('测试通过 membrane 修改封装后的组件', async () => {
  const MyTest = createComponent({
    controller:{},
    view:{
      renderView3(){
        return(
          <div role="renderView3">My renderView3</div>
        )
      }
    }
  })
  render(<MyTest></MyTest>)
  expect(screen.getByRole('renderView3')).toHaveTextContent('My renderView3')
})
