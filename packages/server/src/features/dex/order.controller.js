const { aggregate } = require('../../utils')
const { extractPage } = require('../../utils')
const { getDb } = require('../../services/mongo')

async function getOrdersCol() {
  const db = await getDb()
  return await db.collection('orders')
}

class OrderController {
  async getOpenOrders(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getOrdersCol()

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

  async getPairOpenOrders(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { pairId } = ctx.params

    const query = {
      'props.pairId': parseInt(pairId),
      status: { $ne: 'Canceled' }
    }

    const col = await getOrdersCol()

    const result = await aggregate(col, [
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

    const total = result && result.length > 0 ? result[0].count : 0

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
      { $match: query },
      { $sort: { lastUpdateAt: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize }
    ])

    ctx.body = {
      items: orders,
      page,
      pageSize,
      total
    }
  }

  async getAccountOpenOrders(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { address, pairId } = ctx.params

    const query = {
      'props.submitter': address,
      'props.pairId': parseInt(pairId),
      status: { $ne: 'Canceled' }
    }

    const col = await getOrdersCol()

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
      { $match: query },
      { $sort: { lastUpdateAt: -1 } },
      { $skip: page * pageSize },
      { $limit: pageSize }
    ])

    ctx.body = {
      items: orders,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new OrderController()
