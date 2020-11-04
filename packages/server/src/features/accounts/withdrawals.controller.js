const { getDb } = require('../../services/mongo')
const { extractPage } = require('../../utils')

class WithdrawalsController {
  async getWithdrawals(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { address } = ctx.params

    const db = await getDb()
    const col = await db.collection('event')

    const query = {
      $and: [
        { section: 'xGatewayRecords' },
        { method: 'WithdrawalCreated' },
        { 'data.1.applicant': address }
      ]
    }

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

module.exports = new WithdrawalsController()
