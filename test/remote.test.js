import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { createStore } from '../src'

test('测试 remote 优先级', async () => {
  // 独立的 TestStore 和 Test 组件
  const useTestStore = createStore({
    initState: {
      desc: '',
    },
    view: {
      renderView() {
        return <div role="superView">super view</div>
      },
    },
    controller: {
      onComponentStart() {
        this.rc.setDesc('没有检测到平台异常')
      },
    },
    membrane: {
      initState: {},
      controller: {},
      view: {
        renderView() {
          return (
            <div>
              <div role="subView">
                extends super view<div role="desc">{this.state.desc}</div>
              </div>
            </div>
          )
        },
      },
    },
    remote: {
      initState: {
        desc: 'remote config',
      },
    },
  })
  function Test() {
    const store = useTestStore()
    return <div role="global">{store.view.renderView()}</div>
  }
  // App 初始化
  function App() {
    return <Test></Test>
  }
  render(<App></App>)
  expect(screen.getByRole('desc')).toHaveTextContent('remote config')
})
