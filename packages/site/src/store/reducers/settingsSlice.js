import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    locale: 'en'
  },
  reducers: {
    setLocale(state, action) {
      state.locale = action.payload
    }
  }
})

export const localeSelector = state => state.settings?.locale

export const { setLocale } = settingsSlice.actions

export default settingsSlice.reducer
