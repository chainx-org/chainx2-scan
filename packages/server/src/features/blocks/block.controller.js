const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const { getBlockCollection } = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class BlockController {
  async getBlocks(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getBlockCollection()
    const total = await col.estimatedDocumentCount()
    const blocks = await col
      .find({})
      .sort({ 'header.number': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: blocks,
      page,
      pageSize,
      total
    }
  }

  async getBlock(ctx) {
    const { heightOrHashOrId } = ctx.params
    let query = {}
    if (/^\d+$/.test(heightOrHashOrId)) {
      query = { 'header.number': parseInt(heightOrHashOrId) }
    } else if (isHash(heightOrHashOrId)) {
      query = { hash: ensure0xPrefix(heightOrHashOrId) }
    } else if (isMongoId(heightOrHashOrId)) {
      query = ObjectID(heightOrHashOrId)
    } else {
      ctx.status = 400
      return
    }

    const col = await getBlockCollection()
    ctx.body = await col.findOne(query)
  }
}

module.exports = new BlockController()
