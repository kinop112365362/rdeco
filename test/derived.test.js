import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createStore } from '../src'
test('派生功能是否可用', async () => {
  const useTestStore = createStore({
    initState: {
      count: 0
    },
    derived: {
      count1: state => state.count + 1,
      count2: state => state.count + 2
    },
    controller:{
      onMount(){
        this.setter.count(1)
      }
    }
  })
  function Test () {
    const store = useTestStore()
    useEffect(()=>{
      store.controller.onMount()
    },[])
    return (
      <div>
        <span role='count1'>{store.derived.count1}</span>
        <span role='count2'>{store.derived.count2}</span>
      </div>
    )
  }
  render(<Test></Test>)
  expect(screen.getByRole('count1')).toHaveTextContent('2')
  expect(screen.getByRole('count2')).toHaveTextContent('3')
})
