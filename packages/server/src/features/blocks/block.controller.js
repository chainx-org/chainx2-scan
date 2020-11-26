const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const { getBlockCollection } = require('../../services/mongo')
const { ObjectID } = require('mongodb')
const { encodeAddress } = require('../../utils')
const { getDb } = require('../../services/mongo')

class BlockController {
  async getBlocks(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    const db = await getDb()
    const col = await getBlockCollection()
    const total = await col.estimatedDocumentCount()
    let blocks = await col
      .find({})
      .sort({ 'header.number': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()
    const vacol = await db.collection('validators')
    let address = blocks.map(item => item.author)
    for (let i = 0; i < address.length; i++) {
      let uniq = encodeAddress(address[i])
      let uniqquery = { account: uniq }
      let nickName = await vacol.find(uniqquery).toArray()
      let uniqNickname = nickName[0] ? nickName[0].referralId : null
      blocks[i]['referralId'] = uniqNickname
    }
    ctx.body = {
      items: blocks,
      address,
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

  async getBlockNum(ctx) {
    const { hash } = ctx.params
    let query = {author: hash}
    const col = await getBlockCollection()
    ctx.body = {number: await col.find(query).count()}
  }

  async getBlockEvents(ctx) {
    const { page, pageSize, block } = extractPage(ctx)
    console.log(block)
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
}

module.exports = new BlockController()
