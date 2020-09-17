const { getDb } = require('../../services/mongo')

class DexController {
  async getPairs(ctx) {
    const db = await getDb()
    const col = await db.collection('pairs')

    const items = await col
      .find({})
      .sort({ blockHeight: -1 })
      .limit(1)
      .toArray()
    ctx.body = items.length <= 0 ? [] : items[0].pairs
  }
}

module.exports = new DexController()
