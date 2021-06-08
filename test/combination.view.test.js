import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 combination View', async () => {
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
      this.combination['other'].controller.onNameChange('jacky')
    }
  }
  const useOtherStore = createStore({
    name:'other',
    initState:{
      name:'jacky'
    },
    controller:{
      onNameChange(name){
        this.state.setName(name)
      }
    },
    view:{
      render(){
        return (
          <div role="other">{this.state.name}</div>
        )
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
        console.log(this.combination)
        return(
          <div role="renderView1">{this.combination['other'].view.render()}</div>
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
    useOtherStore()
    return (
      <div>{store.view.renderView3()}</div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('other')).toHaveTextContent('jacky')
})
