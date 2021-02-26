import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import { configCreateStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 view 的内部嵌套', async () => {
  const createStore = configCreateStore({plugins:[]})
  
  render(<Test></Test>)
  expect(screen.getByRole('renderView1')).toHaveTextContent('renderView1')
})
