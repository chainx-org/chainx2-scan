import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'

function loadState() {
  try {
    const serializedState = localStorage.getItem('state')
    if (serializedState === null) {
      return {}
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return {}
  }
}

function saveState(state) {
  const serializedState = JSON.stringify(state)
  localStorage.setItem('state', serializedState)
}

export default function initStore() {
  const persistedState = loadState()

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: persistedState || {}
  })

  store.subscribe(() => {
    const { settings } = store.getState()
    saveState({ settings })
  })

  return store
}
