import { createSlice } from '@reduxjs/toolkit'

const latestBlockSlice = createSlice({
  name: 'latestBlocks',
  initialState: {
    blocks: []
  },
  reducers: {
    setLatestBlocks(state, { payload }) {
      state.blocks = payload
    }
  }
})

export const latestHeightSelector = state =>
  state.latestBlocks.blocks[0]?.number
export const { setLatestBlocks } = latestBlockSlice.actions
export default latestBlockSlice.reducer
