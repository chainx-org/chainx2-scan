const { aggregate } = require('../../utils')
const { extractPage } = require('../../utils')
const { getDb } = require('../../services/mongo')

async function getOrdersCol() {
  const db = await getDb()
  return await db.collection('orders')
}

class OrderController {
  async getAccountOpenOrders(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { address } = ctx.params

    const query = {
      'props.submitter': address
      // status: { $ne: 'Canceled' }
    }

    const col = await getOrdersCol()
    const total = await col.countDocuments(query)

    const open_orders = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: open_orders,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new OrderController()
