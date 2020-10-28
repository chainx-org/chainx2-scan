import { createStore, combineReducers } from 'redux'

const staticReducers = {
  noop: (x = {}) => x
}

function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers
  })
}

export default function configureStore(initialState) {
  const store = createStore(createReducer(), initialState)

  store.asyncReducers = {}

  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer
    store.replaceReducer(createReducer(store.asyncReducers))
  }

  return store
}

export const createCommonReducer = (namespace, initState) => {
  return (state = { ...initState }, action) => {
    switch (action.type) {
      case `${namespace}/setState`:
        return { ...state, ...action.payload }
      default:
        return state
    }
  }
}
