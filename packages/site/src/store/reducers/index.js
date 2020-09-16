import { combineReducers } from 'redux'
import settingsReducer from './settingsSlice'
import latestBlocksReducer from './latestBlockSlice'
import latestExtrinsicsReducer from './latestExtrinsicSlice'
import accountsReducer from './accountSlice'

export default combineReducers({
  settings: settingsReducer,
  latestBlocks: latestBlocksReducer,
  latestExtrinsics: latestExtrinsicsReducer,
  accounts: accountsReducer
})
