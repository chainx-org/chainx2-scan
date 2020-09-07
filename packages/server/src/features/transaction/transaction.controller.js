const { isMongoId } = require('../../utils')
const { extractPage } = require('../../utils')
const {
  getExtrinsicCollection,
  getEventCollection
} = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class TransactionController {
  async getTransaction(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    console.log('address:' + ctx.query.address)

    let address = ctx.query.address
    const col = await getExtrinsicCollection()
    const total = await col.count({ signer: address })
    const enventCol = await getEventCollection()

    const colList = await col
      .find({ signer: address })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    const transactionList = []

    //合并交易结果，成功或者失败
    for (let i = 0; i < colList.length; i++) {
      let transactionStatus = ''
      const eventList = await enventCol
        .find({ extrinsicHash: colList[i].hash })
        .toArray()
      for (let eve = 0; eve < eventList.length; eve++) {
        if (eventList[eve].method == 'ExtrinsicSuccess') {
          transactionStatus = eventList[eve].method
        }
        if (eventList[eve].method == 'ExtrinsicFailed') {
          transactionStatus = eventList[eve].method
        }
      }
      transactionList.push({
        status: transactionStatus,
        ...colList[i]
      })
    }

    ctx.body = {
      items: transactionList,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new TransactionController()
