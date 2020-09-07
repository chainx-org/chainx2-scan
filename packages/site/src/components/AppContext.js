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
    const token = [
      {
        token: 'SDOT',
        token_name: 'Shadow DOT',
        chain: 'Ethereum',
        precision: 3,
        des: 'ChainX s Shadow Polkadot from Ethereum',
        ok: true,
        num: 0
      },
      {
        token: 'PCX',
        token_name: 'Polkadot ChainX',
        chain: 'ChainX',
        precision: 8,
        des: 'ChainX s crypto currency in Polkadot ecology',
        ok: true,
        num: 0
      },
      {
        token: 'L-BTC',
        token_name: 'Lock-up BTC',
        chain: 'Bitcoin',
        precision: 8,
        des: 'ChainX s lock-up Bitcoin',
        ok: true,
        num: 2169035
      },
      {
        token: 'BTC',
        token_name: 'Interchain BTC',
        chain: 'Bitcoin',
        precision: 8,
        des: 'ChainX s interchain Bitcoin',
        ok: true,
        num: 0
      }
    ]
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

export default AppContext
