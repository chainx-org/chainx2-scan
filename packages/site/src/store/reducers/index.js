import { combineReducers } from 'redux'
import settingsReducer from './settingsSlice'
import latestBlocksReducer from './latestBlockSlice'

export default combineReducers({
  settings: settingsReducer,
  latestBlocks: latestBlocksReducer
})
