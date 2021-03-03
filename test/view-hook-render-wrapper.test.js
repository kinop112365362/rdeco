import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试全局的 render hook', async () => {
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
    },
    hook:{
      renderWrapper(renderTarget){
        console.log(renderTarget)
        return (
          <div role="renderWrapper">
            renderWrapper
            {renderTarget()}
          </div>
        )
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>{store.view.renderView3()}</div>
    )
  }
  render(<Test></Test>)
  expect(screen.getAllByRole('renderWrapper'))
})
