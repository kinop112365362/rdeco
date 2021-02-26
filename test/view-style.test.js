import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'
import nodeUtil from 'util';
/**@jsx jsx */
import {jsx, css} from '@emotion/react'

test('测试对 style 的重写', async () => {
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
    controller,
    styles:{
      w100:{
        width: 100
      }
    },
    view:{
      renderView1(){
        return(
          <div  role="renderView1">renderView1</div>
        )
      },
      renderView2(){
        return(
          <div>{this.view.renderView1()}</div>
        )
      },
      renderView3(){
        return(
          <div css={this.styles.w100} id="renderView3" role="renderView3">{this.view.renderView2()}</div>
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
  console.log(nodeUtil.inspect(document.getElementById('renderView3').style, { depth: 1 }));
  expect(screen.getByRole('renderView1')).toHaveTextContent('renderView1')
})
