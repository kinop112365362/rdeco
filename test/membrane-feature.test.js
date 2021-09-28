import React, { useContext } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, createStore } from '../src'

test('测试 membrane 的全部功能', async () => {
  const Mem = createComponent({
    name: 'Mem',
    state: {
      text: '',
      role: 'mem_text',
      clickRole: 'mem_click',
    },
    controller: {
      onClick() {
        this.setter.text('hello')
      },
    },
    view: {
      render() {
        return (
          <div role={this.state.role}>
            {' '}
            <div
              onClick={this.controller.onClick}
              role={this.state.clickRole}
            ></div>
            {this.state.text}
          </div>
        )
      },
    },
  })
  // 独立的 TestStore 和 Test 组件
  const useTestStore = createStore({
    initState: {
      desc: '',
      title: '',
      superService: '',
    },
    view: {
      renderView() {
        return (
          <div>
            <div role="title">{this.state.title}</div>
            <div role="desc">{this.state.desc}</div>
            <div role="superService">{this.state.superService}</div>
          </div>
        )
      },
    },
    service: {
      superService() {},
    },
    controller: {
      onComponentStart() {
        this.rc.setSuperService('superService')
        this.rc.setDesc('没有检测到平台异常')
      },
    },
    membrane: {
      name:'MemMembrane',
      initState: {
        membraneTitle: '',
        membraneService: '',
      },
      service: {
        subService() {},
      },
      controller: {
        onComponentStart() {
          this.service.subService()
          this.rc.setMembraneTitle('spec state in membrane')
          this.rc.setTitle('extends controller')
          this.rc.setMembraneService('membraneService')
        },
      },
      view: {
        renderButton() {
          return (
            <button
              role="button"
              onClick={this.controller.onComponentStart}
            ></button>
          )
        },
        renderView() {
          console.log(this.state)
          return (
            <div>
              <div role="membraneTitle">{this.state.membraneTitle}</div>
              {this.view.renderButton()}
              <div role="membraneService">{this.state.membraneService}</div>
            </div>
          )
        },
      },
    },
  })
  function Test() {
    const store = useTestStore('17dz')
    return (
      <div role="global">
        {store.view.renderView()}
        {/* <Mem sid="far"></Mem>
        <Mem
          sid="sub"
          membrane={{
            state: {
              role: 'mem_sub_text',
              clickRole: 'mem_sub_click',
            },
            controller: {
              onClick() {
                this.setter.text('world')
              },
            },
          }}
        ></Mem> */}
      </div>
    )
  }
  // App 初始化
  function App() {
    return <Test></Test>
  }
  render(<App></App>)
  fireEvent.click(screen.getByRole('button'))
  // fireEvent.click(screen.getByRole('mem_click'))
  // fireEvent.click(screen.getByRole('mem_sub_click'))
  await waitFor(() => {
    expect(screen.getByRole('membraneTitle')).toHaveTextContent(
      'spec state in membrane'
    )
    // expect(screen.getByRole('mem_text')).toHaveTextContent('hello')
    // expect(screen.getByRole('mem_sub_text')).toHaveTextContent('world')
    // expect(screen.getByRole('title')).toHaveTextContent('extends controller')
    // expect(screen.getByRole('desc')).toHaveTextContent('没有检测到平台异常')
    expect(screen.getByRole('membraneService')).toHaveTextContent(
      'membraneService'
    )
    // expect(screen.getByRole('superService')).toHaveTextContent('superService')
  })
})
