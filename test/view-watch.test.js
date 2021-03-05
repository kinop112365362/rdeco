import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 view 性能模式', async () => {
  const createStore = configCreateStore({ plugins: [] })
  const initState = {
    render: 0,
    change: true
  }
  const controller = {
    onButtonClick () {
      this.rc.setChange(false)
    }
  }
  const useTestStore = createStore({
    initState,
    controller,
    view: {
      render: [
        () => {
          console.log('render', 24)
          return <div role='render'> render </div>
        },
        d => [d.state.render]
      ]
    }
  })
  function Test () {
    const store = useTestStore()
    console.log(store.view, 34)
    return (
      <>
        <div role='change'>{store.state.change}</div>
        <button role='button' onClick={store.controller.onButtonClick}></button>
        <div>{store.view.render()}</div>
      </>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() =>
    expect(screen.getByRole('render')).toHaveTextContent('render')
  )
})
