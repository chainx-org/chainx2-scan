const { getDb } = require('../../services/mongo')

class DepthController {
  async getDepth(ctx) {
    const db = await getDb()
    const col = await db.collection('depth')

    const { pairId } = ctx.params
    const { cnt = 50 } = ctx.query

    const asks = await col
      .find({
        pairId: parseInt(pairId),
        isAsk: true
      })
      .sort({ price: -1 })
      .limit(parseInt(cnt))
      .toArray()

    const bids = await col
      .find({
        pairId: parseInt(pairId),
        isAsk: false
      })
      .sort({ price: -1 })
      .limit(parseInt(cnt))
      .toArray()

    ctx.body = {
      asks,
      bids
    }
  }
}

module.exports = new DepthController()
