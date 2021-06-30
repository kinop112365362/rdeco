import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createComponent, createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试框架限制特性', async () => {
  const Text = createComponent({
    name:'Text',
    initState: {
      text: 'default'
    },
    service:{
      transform(){
        expect(this.controller).toBeUndefined()
        expect(this.view).toBeUndefined()
      }
    },
    controller: {
      async onClick () {
        const {text} = this.props
        this.setter.text(text)
        this.service.transform()
        expect(this.controller).toBeUndefined()
        expect(this.view).toBeUndefined()
      },
      onMouse(){
        console.log('mouse')
      }
    },
    view: {
      render () {
        expect(this.service).toBeUndefined()
        return (
          <div role={this.props.name} onClick={this.controller.onClick}>
            {this.state.text.display}
          </div>
        )
      }
    }
  })

  function Test () {
    return (
      <div>
        {[
          { name: 't1', text: { display: 't1' } },
          { name: 't2', text: { display: 't2' } }
        ].map(d => {
          return <Text name={d.name} key={d.name} text={d.text}></Text>
        })}
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('t1'))
})
