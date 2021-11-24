/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent, inject, invoke } from '../src'

test('inject 调用模块方法', async () => {
  setTimeout(() => {
    create({
      name: 'remote-module',
      exports: {
        getName(name, next) {
          console.debug(name, 1)
          next('remote-module')
        },
      },
    })
  }, 1000)
  const name = await inject('remote-module').getName('helloword')

  console.debug(name, 2)

  // const p = new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve()
  //   }, 2000)
  // })
  // await p
})
