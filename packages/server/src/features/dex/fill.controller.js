const { getDb } = require('../../services/mongo')
const { extractPage } = require('../../utils')

class FillController {
  async getFills(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { pairId } = ctx.params

    const db = await getDb()
    const col = await db.collection('deals')

    const query = { pairId: parseInt(pairId) }
    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ executedAt: -1 })
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
  async getKline(ctx) {
    let { pairId, timeCycle } = ctx.params
    let items = []
    var now = new Date().getTime()
    let y = now % parseInt(timeCycle)

    const db = await getDb()
    const col = await db.collection('deals')

    for (let i = 0; i < 100; i++) {
      console.log(now, 'now')
      let query = {
        $and: [
          { pairId: pairId },
          { blockTime: { $gte: now - timeCycle } },
          { blockTime: { $lte: now } }
        ]
      }
      console.log(query)
      var result = await col
        .find(query)
        .sort({ executedAt: -1 })
        .toArray()
      now = now - timeCycle
      items.push(result)
    }
    ctx.body = {
      items
    }
  }
}

module.exports = new FillController()
