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

    const col = await getOrdersCol()

    const { address } = ctx.params

    const query = {
      'props.submitter': address,
      status: { $ne: 'Canceled' }
    }

    console.log('col', col)

    const [{ count: total }] = await aggregate(col, [
      { $sort: { blockHeight: -1 } },
      {
        $group: {
          _id: '$orderId',
          props: { $first: '$props' },
          status: { $first: '$status' }
        }
      },
      { $match: query },
      {
        $count: 'count'
      }
    ])

    const open_orders = await aggregate(col, [
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
      { $match: query },
      { $sort: { lastUpdateAt: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize }
    ])

    ctx.body = {
      items: open_orders,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new OrderController()
