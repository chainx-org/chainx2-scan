import { createSlice } from '@reduxjs/toolkit'

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    locale: 'zh'
  },
  reducers: {
    setLocale(state, action) {
      state.locale = action.payload
    }
  }
})

export const { setLocale } = settingsSlice.actions

export const changeLocale = language => async dispatch => {
  dispatch(setLocale(language))
}

export const localeSelector = state => state.settings.locale

export default settingsSlice.reducer
