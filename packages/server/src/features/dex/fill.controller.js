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
    const currentTime = new Date().getTime()
    const mod = currentTime % parseInt(timeCycle)

    const db = await getDb()
    const col = await db.collection('deals')

    var endTime
    var startTime
    endTime = currentTime - mod
    startTime = endTime - parseInt(timeCycle)

    for (let i = 0; i < 10; i++) {
      // console.log('start time', startTime)
      // console.log('end time', endTime)

      let query = {
        $and: [
          { pairId: parseInt(pairId) },
          { blockTime: { $gte: startTime } },
          { blockTime: { $lte: endTime } }
        ]
      }
      // console.log(query)

      const result = await col
        .find(query)
        .sort({ executedAt: -1 })
        .toArray()

      items.push(result)

      endTime = startTime
      startTime = startTime - parseInt(timeCycle)
    }
    ctx.body = {
      items
    }
  }
}

module.exports = new FillController()
