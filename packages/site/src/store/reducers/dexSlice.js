import { createSlice } from '@reduxjs/toolkit'
import api from '@src/services/api'

const dexSlice = createSlice({
  name: 'dex',
  initialState: {
    pairs: []
  },
  reducers: {
    setPairs(state, action) {
      state.pairs = action.payload
    }
  }
})

const { setPairs } = dexSlice.actions

export const fetchPairs = () => async dispatch => {
  const { result: pairs } = await api.fetch('/dex/pairs')
  dispatch(setPairs(pairs))
}

export default dexSlice.reducer
