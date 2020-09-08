import React, { useContext, useReducer, useEffect } from 'react'
import api from '../services/api'
import { AntSpinner as Spinner } from './index'

const AppContext = React.createContext()

const initialState = { tokens: [], intentions: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'setToken':
      return { ...state, tokens: action.payload }
    case 'setIntentions':
      return { ...state, intentions: action.payload }
    default:
      throw new Error('cant found type')
  }
}

export function AppContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    //TODO 暂时使用mock数据
  }, [api])

  const { tokens = [], intentions = [] } = state
  if (!tokens.length || !intentions.length) {
    return (
      <div
        className="main-content"
        style={{ height: '100%', padding: '20% 0' }}
      >
        <Spinner />
      </div>
    )
  }
  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
