import { combineReducers } from 'redux'
import settingsReducer from './settingsSlice'
import latestBlocksReducer from './latestBlockSlice'
import latestExtrinsicsReducer from './latestExtrinsicSlice'

export default combineReducers({
  settings: settingsReducer,
  latestBlocks: latestBlocksReducer,
  latestExtrinsics: latestExtrinsicsReducer
})
