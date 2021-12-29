/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { createComponent, create, withComponent, inject, invoke } from '../packages/rdeco'

test('inject 调用模块方法', async () => {
  setTimeout(() => {
    create({
      name: 'remote-module',
      exports: {
        getName(name, next) {
          console.debug(name)
          next('remote-module')
        },
      },
    })
  }, 1000)
  const name = await inject('remote-module').getName('helloword')
  const name2 = await inject('remote-module').getName('helloword2')
  const name3 = await inject('remote-module').getName('helloword3')

  // const p = new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve()
  //   }, 2000)
  // })
  // await p
})
