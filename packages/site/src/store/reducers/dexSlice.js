import { createSlice } from '@reduxjs/toolkit'
import api from '@src/services/api'

const dexSlice = createSlice({
  name: 'dex',
  initialState: {
    pairs: [],
    activePair: null
  },
  reducers: {
    setPairs(state, action) {
      state.pairs = action.payload
      state.activePair = state.pairs[0]
    },
    setActivePair(state, action) {
      state.activePair = action.payload
    }
  }
})

const { setPairs, setActivePairIndex } = dexSlice.actions

export const fetchPairs = () => async dispatch => {
  const { result: pairs } = await api.fetch('/dex/pairs')
  dispatch(setPairs(pairs))
}

export const pairsSelector = state => state.dex.pairs
export const activePairSelector = state => state.dex.activePair

export default dexSlice.reducer
