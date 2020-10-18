const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const {
  getBlockCollection,
  getDemocracyCollection
} = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class BlockController {
  async getDemocracy(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getDemocracyCollection()
    const total = await col.estimatedDocumentCount()
    const democracy = await col
      .find({})
      .sort({ time: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: democracy,
      page,
      pageSize,
      total
    }
  }

  async submitDemocracy(ctx) {
    const { account, democracy, hash } = ctx.request.body
    const col = await getDemocracyCollection()

    const democracyData = {
      account: account,
      democracy: democracy,
      hash: hash,
      time: new Date().getTime()
    }
    await col.insertOne({
      ...democracyData
    })
    ctx.body = {
      msg: 'submit  democracy success',
      data: {
        ...democracyData
      }
    }
  }
}

module.exports = new BlockController()
