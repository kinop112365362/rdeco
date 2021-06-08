import React, { useContext } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createStore } from '../src'

test('测试 membrane 的全部功能', async () => {
  // 独立的 TestStore 和 Test 组件
  const useTestStore = createStore({
    initState: {
      desc: '',
      title: '',
      superService: ''
    },
    view: {
      renderView () {
        return (
          <div>
            <div role='title'>{this.state.title}</div>
            <div role='desc'>{this.state.desc}</div>
            <div role='superService'>{this.state.superService}</div>
          </div>
        )
      }
    },
    service: {
      superService () {}
    },
    controller: {
      onComponentStart () {
        this.state.setSuperService('superService')
        this.state.setDesc('没有检测到平台异常')
      }
    },
    membrane: {
      initState: {
        membraneTitle: '',
        membraneService: ''
      },
      service: {
        subService () {}
      },
      controller: {
        onComponentStart () {
          this.service.subService()
          this.state.setMembraneTitle('spec state in membrane')
          this.state.setTitle('extends controller')
          this.state.setMembraneService('membraneService')
        }
      },
      view: {
        renderButton () {
          return (
            <button
              role='button'
              onClick={this.controller.onComponentStart}
            ></button>
          )
        },
        renderView () {
          console.log(this.state)
          return (
            <div>
              <div role='membraneTitle'>{this.state.membraneTitle}</div>
              {this.view.renderButton()}
              <div role='membraneService'>{this.state.membraneService}</div>
            </div>
          )
        }
      }
    }
  })
  function Test () {
    const store = useTestStore('17dz')
    return <div role='global'>{store.view.renderView()}</div>
  }
  // App 初始化
  function App () {
    return <Test></Test>
  }
  render(<App></App>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('membraneTitle')).toHaveTextContent(
      'spec state in membrane'
    )
    // expect(screen.getByRole('title')).toHaveTextContent('extends controller')
    // expect(screen.getByRole('desc')).toHaveTextContent('没有检测到平台异常')
    expect(screen.getByRole('membraneService')).toHaveTextContent(
      'membraneService'
    )
    // expect(screen.getByRole('superService')).toHaveTextContent('superService')
  })
})
