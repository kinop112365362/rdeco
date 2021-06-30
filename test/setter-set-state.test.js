import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createStore } from '../src'
test('测试 setter.setState 可以获取前置的 state', async () => {
  const initState = {
    count: 0,
    msg: '',
    tabs: [
      { title: '首页', active: true, id: 0 },
      { title: '纳税设置', active: false, id: 1 },
      { title: '纳税申报', active: false, id: 2 }
    ]
  }
  const service = {}
  const controller = {
    onComponentInit () {
      this.setter.tabs(tabs => tabs.filter(tab => tab.id !== 2));
      this.setter.state(prevState => {
        if (prevState.count === 0) {
          return {
            msg: 'count 是 0'
          }
        }
      })
      ++this.ref.count
      console.log(this.ref.count)
    }
  }
  const useTestStore = createStore({
    initState,
    ref:{
      count:0,
    },
    service,
    controller
  })
  function Test () {
    const store = useTestStore()
    useEffect(() => {
      store.controller.onComponentInit()
      console.log(store.ref.count)
    }, [])
    return (
      <div>
        <span role='msg'>{store.state.msg}</span>
        <span role='tab'>{store.state.tabs.length}</span>
        <span role='ref'>{store.ref.count}</span>
      </div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('msg')).toHaveTextContent('count 是 0')
  expect(screen.getByRole('tab')).toHaveTextContent('2')
  expect(screen.getByRole('ref')).toHaveTextContent('1')
})

