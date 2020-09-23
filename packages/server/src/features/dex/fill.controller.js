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
}

module.exports = new FillController()
