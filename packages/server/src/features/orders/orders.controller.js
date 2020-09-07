const { extractPage } = require('../../utils')
const { getExtrinsicCollection } = require('../../services/mongo')

class OrdersController {
  async getCurrentOrders(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    let address = ctx.query.address
    const col = await getExtrinsicCollection()
    let sql = {
      $and: [{ signer: address }, { section: 'xSpot' }, { name: 'putOrder' }]
    }
    const total = await col.count(sql)
    const nominationList = await col
      .find(sql)
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: nominationList,
      page,
      pageSize,
      total
    }
  }

  async getHistoryOrders(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    console.log('address:' + ctx.query.address)

    let address = ctx.query.address
    const col = await getExtrinsicCollection()
    const total = await col.count({
      $and: [{ signer: address }, { section: 'xSpot' }]
    })
    const nominationList = await col
      .find({ $and: [{ signer: address }, { section: 'xSpot' }] })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: nominationList,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new OrdersController()
