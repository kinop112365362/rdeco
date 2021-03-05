import React, { useContext } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createStoreHook } from '../src/core/create-store-hook'
import { AppContext, createStoreContext } from '../src/core/app-context'
import '@testing-library/jest-dom/extend-expect'

test('测试 membrane 对 store 的 view 的继承', async () => {
  // 独立的 TestStore 和 Test 组件
  const useTestStore = createStoreHook.main({
    initState: {
      desc: ''
    },
    view: {
      renderView () {
        console.log(70)
        return <div role='superView'>super view</div>
      }
    },
    controller: {
      onComponentStart () {
        this.rc.setDesc('没有检测到平台异常')
      }
    },
    membrane: {
      initState: {},
      controller: {},
      view: {
        renderView () {
          return (
            <div>
              {/* {this.view.renderView()} */}
              <div role='subView'>extends super view</div>
            </div>
          )
        }
      }
    }
  })
  function Test () {
    const store = useTestStore()
    console.log(store.view, 100)
    return <div role='global'>{store.view.renderView()}</div>
  }
  // App 初始化
  function App () {
    return <Test></Test>
  }
  render(<App></App>)
  // expect(screen.getByRole('superView')).toHaveTextContent('super view')
  expect(screen.getByRole('subView')).toHaveTextContent('extends super view')
})
test('测试 membrane 的全部功能', async () => {
  // 独立的 TestStore 和 Test 组件
  const useTestStore = createStoreHook.main({
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
        this.rc.setSuperService('superService')
        this.rc.setDesc('没有检测到平台异常')
      }
    },
    membrane: {
      initState: {
        membraneTitle: '',
        membraneService: ''
      },
      service: {
        subService () {
        }
      },
      controller: {
        onComponentStart () {
          console.log(this.props, 142)
          if (this.props === '17dz') {
            this.service.subService()
            this.rc.setMembraneTitle('spec state in membrane')
            this.rc.setTitle('extends controller')
            this.rc.setMembraneService('membraneService')
          }
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
          console.log(this.state, 162)
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
    console.log(store, 179)
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
