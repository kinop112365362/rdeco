import React, { useContext } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { createStoreHook } from '../src/core/create-store-hook'
import { AppContext, createStoreContext } from '../src/core/app-context'
import '@testing-library/jest-dom/extend-expect'

// test('通过 membrane 新增的 store 部件对 UI 不可见, 除 view', async () => {
//   // 独立的 TestStore 和 Test 组件
//   const useTestStore = createStoreHook.main({
//     name: 'testStore5',
//     initState: {
//       desc: ''
//     },
//     view: {
//       renderView () {
//         return <div role='desc'>{this.state.desc}</div>
//       }
//     },
//     controller: {
//       onComponentStart () {
//         this.rc.setDesc('没有检测到平台异常')
//       }
//     },
//     membrane: {
//       initState: {
//         text: '欢迎来到 17dz'
//       },
//       ref: {
//         el: 0
//       },
//       view: {
//         renderMembrane () {}
//       },
//       controller: {
//         onMembraneController () {}
//       }
//     }
//   })
//   function Test () {
//     const store = useTestStore()
//     console.log(store, 43)
//     expect(Object.keys(store.view)).toStrictEqual([
//       'renderView',
//       'renderMembrane'
//     ])
//     expect(Object.keys(store.state)).toStrictEqual(['desc'])
//     expect(Object.keys(store.controller)).toStrictEqual(['onComponentStart'])
//     expect(Object.keys(store.refs).length).toBe(0)
//     return <div role='global'>{store.view.renderView()}</div>
//   }
//   // App 初始化
//   function App () {
//     return <Test></Test>
//   }
//   render(<App></App>)
// })
test('测试 membrane 对 store 的 view 的继承', async () => {
  // 独立的 TestStore 和 Test 组件
  const useTestStore = createStoreHook.main({
    name: 'testStore5',
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
    name: 'testStore5',
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
          // this.super.service.superService()
        }
      },
      controller: {
        onComponentStart () {
          console.log(this.props, 142)
          if (this.props === '17dz') {
            // this.super.controller.onComponentStart()
            this.service.subService()
            this.rc.setMembraneService('membraneService')
            this.rc.setTitle('extends controller')
            this.rc.setMembraneTitle('spec state in membrane')
          }
          // this.super.controller.onComponentStart()
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
          return (
            <div>
              {/* {this.props === '17dz' && this.view.renderView()} */}
              <div role='membraneTitle'>{this.state.membraneTitle}</div>
              {this.view.renderButton.call(this)}
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
