import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 controller hook', async () => {
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
      console.log('doing')
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
      beforeConfirmButtonClick(){
        console.log('before')
      },
      afterConfirmButtonClick(){
        console.log('after')
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>
        <button data-role="button" onClick={store.controller.onConfirmButtonClick}></button>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
})
