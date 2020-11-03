import { createSlice } from '@reduxjs/toolkit'

const latestChainStatusSlice = createSlice({
  name: 'latestChainStatus',
  initialState: {
    status: []
  },
  reducers: {
    setLatestChainStatus(state, { payload }) {
      state.status = payload
    }
  }
})

export const latestChainStatusSelector = state => state.latestChainStatus.status
export const { setLatestChainStatus } = latestChainStatusSlice.actions
export default latestChainStatusSlice.reducer
