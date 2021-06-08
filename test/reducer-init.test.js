import React, { useContext, useEffect } from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import { AppContext } from '../src/app-context'
import { createStore } from '../src/index'
import '@testing-library/jest-dom/extend-expect'

test('storeConfig 中的 init 参数, 能否拿到 context', async () => {
  const initState = {
    showConfirmModal: true,
    language: ''
  }

  const service = {
    openModal () {}
  }
  const controller = {
    onConfirmButtonClick () {
      console.log(this.rc)
      this.service.openModal()
      this.rc.setShowConfirmModal('true')
    }
  }
  const useTestStore = createStore({
    initState,
    service,
    controller,
    view: {
      renderCountry () {
        return <div role='country'>{this.rc.country}</div>
      }
    },
    membrane: {
      initState: {
        country: 'en'
      },
      controller: {}
    }
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
    return (
      <div>
        <button
          role='confirm'
          onClick={store.controller.onConfirmButtonClick}
        ></button>
        <span role='showConfirmModal'>{store.state.showConfirmModal}</span>
        <span role='language'>{store.state.language}</span>
        {store.view.renderCountry()}
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
  await waitFor(() => {
    expect(screen.getByRole('country')).toHaveTextContent('en')
  })
})
