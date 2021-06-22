import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore, enhanceCreateComponent } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('测试 combination 多实例下 sid 的运用', async () => {
  const initState = {
    showConfirmModal: false
  }
  const service = {
    async openModal () {
      return 'true'
    }
  }
  const controller = {
    onButtonClick () {
      this.combination['other'].controller.onNameChange('jacky')
      this.combination.$find('other', '1').controller.onNameChange('jacky1')
      this.combination.$find('other', '2').controller.onNameChange('jacky2')
    }
  }

  function Other ({ sid }) {
    let role = 'name'
    if (sid) {
      role += sid
    }
    const useOtherStore = createStore({
      name: 'other',
      sid,
      initState: {
        name: ''
      },
      controller: {
        onNameChange (name) {
          this.rc.setName(name)
        }
      }
    })
    const store = useOtherStore()

    return <div role={role}>{store.state.name}</div>
  }
  const useTestStore = createStore({
    initState,
    service,
    controller,
    styles: {
      width: 100
    },
    view: {
      renderView1 () {
        return <div role='renderView1'>renderView1</div>
      },
      renderView2 () {
        return <div>{this.view.renderView1()}</div>
      },
      renderView3 () {
        return (
          <div>
            {this.view.renderView2()}{' '}
            <button
              role='button'
              onClick={this.controller.onButtonClick}
            ></button>
          </div>
        )
      }
    }
  })
  const createComponent = enhanceCreateComponent([])
  const Com = createComponent({
    view:{
      render(){
        return <div>Com</div>
      }
    }
  })
  function Test () {
    const store = useTestStore()
    return (
      <div>
        {store.view.renderView3()}
        <Other />
        <Other sid='1' />
        <Other sid='2' />
        <Com></Com>
      </div>
    )
  }
  render(<Test></Test>)
  fireEvent.click(screen.getByRole('button'))
  await waitFor(() => {
    expect(screen.getByRole('name')).toHaveTextContent('jacky')
    expect(screen.getByRole('name1')).toHaveTextContent('jacky1')
    expect(screen.getByRole('name2')).toHaveTextContent('jacky2')
  })
})
