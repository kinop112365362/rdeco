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
      count1 () {
        return this.state.count + 1
      },
      count2 () {
        return this.state.count + 2
      },
      nameFromProps(){
        return 'hello ' + this.props.name
      }
    },
    controller: {
      onMount () {
        this.setter.count(1)
      }
    }
  })
  function Test (props) {
    const store = useTestStore(props)
    useEffect(() => {
      store.controller.onMount()
    }, [])
    return (
      <div>
        <span role='count1'>{store.derived.count1}</span>
        <span role='count2'>{store.derived.count2}</span>
        <span role='name'>{store.derived.nameFromProps}</span>
      </div>
    )
  }
  render(<Test name="jacky"></Test>)
  expect(screen.getByRole('count1')).toHaveTextContent('2')
  expect(screen.getByRole('count2')).toHaveTextContent('3')
  expect(screen.getByRole('name')).toHaveTextContent('hello jacky')
})
