import { combineReducers } from 'redux'
import settingsReducer from './settingsSlice'

export default combineReducers({
  settings: settingsReducer
})
