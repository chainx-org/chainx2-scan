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
  async getBtcCoinBridgeDeposited(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('event')

    const query = {
      $and: [{ section: 'xGatewayBitcoin' }, { method: 'Deposited' }]
    }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }

  async getBtcCoinBridgeWithdrawl(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('event')

    const query = {
      $and: [{ section: 'xGatewayBitcoin' }, { method: 'WithdrawalCreated' }]
    }

    const sum = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items,
      page,
      pageSize,
      sum
    }
  }
  async getBtcAddress(ctx) {
    const api = await getApi()
    const trusteeListInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()
    const trusteeListInfoJSON = trusteeListInfo.toJSON()
    ctx.body = {
      trusteeListInfoJSON
    }
  }
}

module.exports = new HomeController()
