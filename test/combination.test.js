import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 combination', async () => {
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
    onButtonClick(){
      console.log(this.combination)
      this.combination['other'].onNameChange('jacky')
    }
  }
  const useOtherStore = createStore({
    name:'other',
    initState:{
      name:''
    },
    controller:{
      onNameChange(name){
        this.rc.setName(name)
      }
    }
  })
  function Other(){
    const store = useOtherStore()
    console.log(store, 36)
    return(
      <div role='name'>{store.state.name}</div>
    )
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
          <div>{this.view.renderView2()} <button role='button' onClick={this.controller.onButtonClick}></button></div>
          
        )
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>{store.view.renderView3()}<Other/></div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() =>
    expect(screen.getByRole('name')).toHaveTextContent('jacky')
  )
})
