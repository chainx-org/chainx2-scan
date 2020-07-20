import { createSlice } from '@reduxjs/toolkit'

const latestExtrinsicSlice = createSlice({
  name: 'latestExtrinsics',
  initialState: {
    extrinsics: []
  },
  reducers: {
    setLatestExtrinsics(state, { payload }) {
      state.extrinsics = payload
    }
  }
})

export const latestExtrinsicsSelector = state =>
  state.latestExtrinsics.extrinsics
export const { setLatestExtrinsics } = latestExtrinsicSlice.actions

export default latestExtrinsicSlice.reducer
