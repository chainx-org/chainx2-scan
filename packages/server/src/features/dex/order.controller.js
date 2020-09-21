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

    const [{ count: total }] = await new Promise((resolve, reject) => {
      col.aggregate(
        [
          { $sort: { blockHeight: -1 } },
          {
            $group: {
              _id: '$orderId'
            }
          },
          {
            $count: 'count'
          }
        ],
        (err, cursor) => {
          if (err) {
            reject(err)
          } else {
            cursor.toArray((err, docs) => {
              if (err) {
                reject(err)
              } else {
                resolve(docs)
              }
            })
          }
        }
      )
    })

    const orders = await new Promise((resolve, reject) => {
      col.aggregate(
        [
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
        ],
        (err, cursor) => {
          if (err) {
            reject(err)
          } else {
            cursor.toArray((err, docs) => {
              if (err) {
                reject(err)
              } else {
                resolve(docs)
              }
            })
          }
        }
      )
    })

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
