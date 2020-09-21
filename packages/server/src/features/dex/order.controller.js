const { aggregate } = require('../../utils')
const { extractPage } = require('../../utils')
const { getDb } = require('../../services/mongo')

class OrderController {
  async getOpenOrders(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('orders')

    const [{ count: total }] = await aggregate(col, [
      { $sort: { blockHeight: -1 } },
      {
        $group: {
          _id: '$orderId'
        }
      },
      {
        $count: 'count'
      }
    ])

    const orders = await aggregate(col, [
      { $sort: { blockHeight: -1 } },
      {
        $group: {
          _id: '$orderId',
          blockHeight: { $first: '$blockHeight' },
          blockHash: { $first: '$blockHash' },
          props: { $first: '$props' },
          status: { $first: '$status' },
          remaining: { $first: '$remaining' },
          executedIndices: { $first: '$executedIndices' },
          alreadyFilled: { $first: '$alreadyFilled' },
          lastUpdateAt: { $first: '$lastUpdateAt' }
        }
      },
      { $sort: { lastUpdateAt: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize }
    ])

    ctx.body = {
      items: orders.map(o => ({
        orderId: o._id,
        ...o
      })),
      page,
      pageSize,
      total
    }
  }
}

module.exports = new OrderController()
