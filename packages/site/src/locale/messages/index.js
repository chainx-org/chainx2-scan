import common from './common'
import block from './block'
import extrinsic from './extrinsic'
import txAction from './txAction'
import event from './event'
import accounts from "./accounts";
import nomination from "./nomination";

export default {
  ...common,
  ...block,
  ...extrinsic,
  ...txAction,
  ...event,
  ...accounts,
  ...nomination
}
