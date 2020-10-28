import common from './common'
import block from './block'
import crossBlock from './crossBlock'
import extrinsic from './extrinsic'
import txAction from './txAction'
import event from './event'
import accounts from './accounts'
import nomination from './nomination'
import assets from './assets'
import dex from './dex'
import validators from './validators'

export default {
  ...common,
  ...block,
  ...crossBlock,
  ...extrinsic,
  ...txAction,
  ...event,
  ...accounts,
  ...nomination,
  ...assets,
  ...dex,
  ...validators
}
