import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'
import { getStateType } from '../src/get-reducer-model'

const logger = {
  logArr: [{ start: null }],
  push (logNode) {
    if ((this.logArr[0].start = false)) {
      throw new Error('当前日志为从 controller 触发, 可能存在异常' + logNode)
    }
    this.logArr.push(logNode)
  },
  print () {
    const groupKey = this.logArr.pop().logNode
    console.group(groupKey)
    this.logArr.forEach(logNode => {
      console.log(logNode)
    })
    console.groupEnd(groupKey)
    this.logArr.length = 0
  },
  start (ctrlNode) {
    if (this.logArr[0].start === null) {
      this.logArr.push({
        logNode: ctrlNode,
        start: true
      })
    }
    if (this.logArr[0].start) {
      this.print()
      this.logArr.push({
        logNode: ctrlNode,
        start: true
      })
    }
  }
}
test('测试 enhance', async () => {
  const enhance = [
    s => {
      const rcKeys = Object.keys(s.rc)
      rcKeys.forEach(rcKey => {
        const originRc = s.rc[rcKey]
        s.rc[rcKey] = (...args) => {
          logger.push(rcKey)
          logger.push(`CurrentValue: ${s.state[getStateType(rcKey)]}`)
          logger.push(`NextValue: ${args}`)
          originRc(...args)
        }
      })
      if (s.controller) {
        const ctrlKeys = Object.keys(s.controller)
        ctrlKeys.forEach(ctrlKey => {
          const originCtrl = s.controller[ctrlKey]
          s.controller[ctrlKey] = (...args) => {
            logger.start(ctrlKey)
            if (args) {
              logger.push(args)
            }
            return originCtrl(...args)
          }
        })
      }
      if (s.service) {
        const serviceKeys = Object.keys(s.service)
        serviceKeys.forEach(serviceKey => {
          const originCtrl = s.service[serviceKey]
          s.service[serviceKey] = (...args) => {
            logger.push(serviceKey)
            if (args) {
              logger.push(args)
            }
            return originCtrl(...args)
          }
        })
      }
      return s
    }
  ]
  const storeConfig = {
    initState: { name: 'jacky', age: 19 },
    controller: {
      onNameChange () {
        this.rc.setName('hello world')
      },
      onAgeChange () {
        this.rc.setAge(18)
      }
    }
  }
  const useStore = createStore(storeConfig, enhance)
  function Test () {
    const store = useStore()
    return (
      <div role='name'>
        {store.state.name}{' '}
        <button role='button' onClick={store.controller.onNameChange}></button>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() =>
    expect(screen.getByRole('name')).toHaveTextContent('hello world')
  )
})
