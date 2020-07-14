import { createSlice } from '@reduxjs/toolkit'

const blockSlice = createSlice({
  name: 'blocks',
  initialState: {
    blocks: [],
    page: 0,
    pageSize: 10
  },
  reducers: {
    setBlocks(state, { payload: { blocks, page, pageSize } }) {
      state.blocks = blocks
      state.page = page
      state.pageSize = pageSize
    }
  }
})

export default blockSlice.reducer
