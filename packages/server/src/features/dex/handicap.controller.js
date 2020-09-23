const { aggregate } = require('../../utils')
const { extractPage } = require('../../utils')
const { getDb } = require('../../services/mongo')

async function getOrdersCol() {
  const db = await getDb()
  return await db.collection('orders')
}

class HandicapController {
  async getHandicap(ctx) {
    const { pairId } = ctx.params

    const query = {
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
      { $sort: { lastUpdateAt: -1 } }
    ])

    const asks = orders
      .filter(item => item.props.side == 'Sell')
      .map(item => {
        const {
          props: { pairId, side, price, amount }
        } = item
        return Object.assign({}, { pairId, direction: side, price, amount })
      })

    const bids = orders
      .filter(item => item.props.side == 'Buy')
      .map(item => {
        const {
          props: { pairId, side, price, amount }
        } = item
        return Object.assign({}, { pairId, direction: side, price, amount })
      })

    ctx.body = Object.assign({}, { asks, bids })
  }
}

module.exports = new HandicapController()
