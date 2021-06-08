import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 service hook', async () => {
  const initState = {
    showConfirmModal: false,
    name: ''
  }
  const service = {
    async queryName () {
      return 'jacky'
    },
    async openModal (isOpen) {
      return isOpen
    }
  }
  const controller = {
    async onConfirmButtonClick () {
      const res = await this.service.openModal(1)
      console.log(res)
      const name = await this.service.queryName()
      this.state.setShowConfirmModal(res)
      this.state.setName(name)
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller,
    view: {
      renderView1 () {
        return <div role='showConfirmModal'>{this.state.showConfirmModal}</div>
      },
      renderView2 () {
        return <div>{this.view.renderView1()}</div>
      },
      renderView3 () {
        return <div>{this.view.renderView2()}</div>
      }
    },
    hook: {
      serviceWrapper (target, key, ...args) {
        if (key === 'openModal') {
          return target(args[0] === 1 ? 'true' : 'false')
        }
        return target(...args)
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>
        {store.view.renderView3()}
        <div role='name'>{store.state.name}</div>
        <button
          data-role='button'
          onClick={store.controller.onConfirmButtonClick}
        ></button>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('showConfirmModal')).toHaveTextContent('true')
    expect(screen.getByRole('name')).toHaveTextContent('jacky')
  })
})
