import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/core/app-context'
import createStore, { createStoreContext } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('storeConfig 中的 init 参数, 能否拿到 context', async () => {
  const initState = [
    { showConfirmModal: true, language: '' },
    function (initState) {
      console.log(this, 11)
      return {
        showConfirmModal: false,
        language: this.context.state.language
      }
    }
  ]
  const service = {
    openModal: [
      'openModal',
      function openModal () {
        console.log(this, 13)
      }
    ]
  }
  const controller = {
    onConfirmButtonClick () {
      this.service.openModal()
      this.rc.setShowConfirmModal('true')
    }
  }
  const useTestStore = createStore({
    name: 'testStore1',
    initState,
    service,
    controller
  })
  const useAppStore = createStore({
    initState: {
      language: 'en'
    },
    controller: {
      onLanguageChange (language) {
        this.rc.setLanguage(language)
      }
    }
  })
  function Test () {
    const store = useTestStore()
    console.log(store, 50)
    return (
      <div>
        <button
          role='confirm'
          onClick={store.controller.onConfirmButtonClick}
        ></button>
        <span role='showConfirmModal'>{store.state.showConfirmModal}</span>
        <span role='language'>{store.state.language}</span>
      </div>
    )
  }
  function App () {
    const appStore = useAppStore()

    return (
      <AppContext.Provider value={appStore}>
        <Test></Test>
      </AppContext.Provider>
    )
  }
  render(<App></App>)
  fireEvent.click(screen.getByRole('confirm'))
  await waitFor(() =>
    expect(screen.getByRole('language')).toHaveTextContent('en')
  )
})
