import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 view 的内部嵌套', async () => {
  const state = {
    showConfirmModal: false
  }
  const service = {
    async openModal () {
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
    state,
    service,
    controller,
    view: {
      renderView1 () {
        console.log(this.props)
        return <div role='renderView1'>{this.props.globalStore.name}</div>
      },
      renderView2 () {
        return <div>{this.view.renderView1()}</div>
      },
      renderView3 () {
        return <div>{this.view.renderView2()}</div>
      }
    }
  })
  function Test (props) {
    const store = useTestStore(props)
    return <div>{store.view.renderView3()}</div>
  }
  render(<Test globalStore={{ name: 'jacky' }}></Test>)
  expect(screen.getByRole('renderView1')).toHaveTextContent('jacky')
})
