const { extractPage } = require('../../utils')
const { getTransferColCollection } = require('../../services/mongo')

class TransferController {
  async getTransfer(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    console.log('address:' + ctx.query.address)

    let address = ctx.query.address
    const col = await getTransferColCollection()
    const total = await col.count({ from: address })
    const transferList = await col
      .find({ from: address })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: transferList,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new TransferController()
