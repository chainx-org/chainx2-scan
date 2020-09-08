import common from './common'
import block from './block'
import extrinsic from './extrinsic'
import txAction from './txAction'
import event from './event'
import accounts from './accounts'
import nomination from './nomination'
import assets from './assets'

export default {
  ...common,
  ...block,
  ...extrinsic,
  ...txAction,
  ...event,
  ...accounts,
  ...nomination,
  ...assets
}
