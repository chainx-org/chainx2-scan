const { getApi } = require('../../api')
const { getDb } = require('../../services/mongo')
const { isNum } = require('../../utils')
const { isHash } = require('../../utils')
const { getExtrinsicCollection } = require('../../services/mongo')
const { isEventId, extractEvent } = require('../../utils')
const { isMongoId } = require('../../utils')
const { extractPage } = require('../../utils')
const { getEventCollection } = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class HomeController {
  async getBtcStatus(ctx) {
    const api = await getApi()
    const trusteeListInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()
    const trusteeListInfoJSON = trusteeListInfo.toJSON()

    const db = await getDb()
    const col = await db.collection('event')

    // 充值交易数
    const depositQuery = {
      $and: [{ section: 'xGatewayBitcoin' }, { method: 'Deposited' }]
    }
    const depositCount = await col.countDocuments(depositQuery)

    // 提现交易数
    const withdrawalQuery = {
      $and: [{ section: 'xGatewayBitcoin' }, { method: 'WithdrawalCreated' }]
    }
    const withdrawalCount = await col.countDocuments(withdrawalQuery)

    ctx.body = {
      ...trusteeListInfoJSON,
      depositCount
    }
  }
}

module.exports = new HomeController()
