import common from './common'
import block from './block'
import extrinsic from './extrinsic'
import txAction from './txAction'
import event from './event'

export default {
  ...common,
  ...block,
  ...extrinsic,
  ...txAction,
  ...event
}
