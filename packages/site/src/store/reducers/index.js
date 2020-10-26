import { combineReducers } from 'redux'
import settingsReducer from './settingsSlice'
import latestBlocksReducer from './latestBlockSlice'
import latestExtrinsicsReducer from './latestExtrinsicSlice'
import accountsReducer from './accountSlice'
import assetReducer from './assetSlice'
import dexReducer from './dexSlice'
import crossBlocksReducer from './crossBlocksSlice'
import validatorsReducer from './validatorsSlice'

export default combineReducers({
  settings: settingsReducer,
  latestBlocks: latestBlocksReducer,
  latestExtrinsics: latestExtrinsicsReducer,
  accounts: accountsReducer,
  assets: assetReducer,
  dex: dexReducer,
  crossblocks: crossBlocksReducer,
  validators: validatorsReducer
})
