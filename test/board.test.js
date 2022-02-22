import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { create } from '@rdeco/core'
import { createComponent } from '@rdeco/web-app-sdk'

// function createModule(num) {
//   for (let i = 0; i < num; i++) {
//     create({
//       name: `cl${i}`,
//       subscribe: {
//         '@hrss-data-model/login': {
//           event: {
//             helloHee() {
//               console.debug(`hi${i}`)
//             },
//           },
//         },
//       },
//     })
//   }
// }

test('测试 props 的正确归属', async () => {
  create({
    name: '@hrss-data-model/login',
    controller: {
      onMount() {
        this.emit('helloHee')
      },
    },
  })
  // createModule(40)
  const COM = createComponent({
    name: 'com',
    view: {
      render() {
        return <div></div>
      },
    },
  })
  function Test() {
    return (
      <div>
        <COM></COM>
      </div>
    )
  }
  render(<Test></Test>)
})
