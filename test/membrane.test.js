import React, { useContext } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createStore } from '../src'

test('测试 membrane 对 store 的 view 的继承', async () => {
  // 独立的 TestStore 和 Test 组件
  const useTestStore = createStore({
    initState: {
      desc: ''
    },
    view: {
      renderView () {
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