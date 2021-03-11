import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createStore } from '../src'
test('测试 rc.setState 可以获取前置的 state', async () => {
  const initState = {
    count: 0,
    msg: ''
  }
  const service = {}
  const controller = {
    onComponentInit () {
      this.rc.setState(prevState => {
        if (prevState.count === 0) {
          return {
            msg: 'count 是 0'
          }
        }
      })
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller
  })
  function Test () {
    const store = useTestStore()
    useEffect(() => {
      store.controller.onComponentInit()
    }, [])
    return (
      <div>
        <span role='msg'>{store.state.msg}</span>
      </div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('msg')).toHaveTextContent('count 是 0')
})

