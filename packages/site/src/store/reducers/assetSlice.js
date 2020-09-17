import { createSlice } from '@reduxjs/toolkit'
import api from '@src/services/api'

const assetSlice = createSlice({
  name: 'assets',
  initialState: {
    nativeAsset: null,
    foreignAssets: []
  },
  reducers: {
    setNativeAsset(state, action) {
      state.nativeAsset = action.payload
    },
    setForeignAssets(state, action) {
      state.foreignAssets = action.payload
    }
  }
})

export const { setForeignAssets, setNativeAsset } = assetSlice.actions

export const fetchNativeAssetInfo = () => async dispatch => {
  const { result: nativeAsset } = await api.fetch('/native_asset')
  dispatch(setNativeAsset(nativeAsset))
}

export const fetchForeignAssetsInfo = () => async dispatch => {
  const { result: foreignAssets } = await api.fetch('/foreign_asset')
  dispatch(setForeignAssets(foreignAssets))
}

export default assetSlice.reducer
