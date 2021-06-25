import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createStore } from '../src'

test('测试 ref 有效性', async () => {
  const BaseButton = {
    initState:{
      text:'jacky'
    },
    ref:{
      count:0
    },
    controller:{
      onClick(){
        ++this.ref.count
        this.rc.setState({
          text:'ann'
        })
        console.log(this);
      }
    },
    view:{
      render(){
        console.log(this)
        return(
          <div role="button" onClick={this.controller.onClick}>
            <div role="ref">{this.ref.count}</div>
            <div role="text">{this.state.text}</div>
          </div>
        )
      }
    }
  }
  function Test(){
    const useStore = createStore(BaseButton)
    const store = useStore()
    return (
      <div>{store.view.render()}</div>
    )
  }
  // const ExtendButton = createComponent(BaseButton)
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() =>
    expect(screen.getByRole('ref')).toHaveTextContent('1')
  )
})

