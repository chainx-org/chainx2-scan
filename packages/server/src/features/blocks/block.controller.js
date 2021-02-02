const { getExtrinsicCollection } = require('../../services/mongo')
const { decodeAddress } = require('../../utils')
const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const {
  getBlockCollection,
  getEventCollection
} = require('../../services/mongo')
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
      const eventQuery = {
        'indexer.blockHeight': parseInt(blocks[i].header.number)
      }
      const eventCol = await getEventCollection()
      const totalEvents = await eventCol.countDocuments(eventQuery)
      blocks[i]['eventCount'] = totalEvents
    }
    ctx.body = {
      items: blocks,
      address,
      page,
      pageSize,
      total
    }
  }

  async getBlockNum(ctx) {
    const { params } = ctx.params
    let query = { author: params }
    const col = await getBlockCollection()
    ctx.body = { number: await col.find(query).count() }
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

  async getBlockEvents(ctx) {
    const { page, pageSize, block } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getBlockCollection()
    const total = await col.estimatedDocumentCount()
    const blocks = await col
      .find({})
      .sort({ 'header.number': -1 })
      .skip((page + 1) * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: blocks,
      page,
      pageSize,
      total
    }
  }

  async getNodeBlock(ctx) {
    let { page, pageSize } = extractPage(ctx)
    page = page - 1
    const { address } = ctx.params
    let hash = decodeAddress(address)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getBlockCollection()
    let query = { author: hash }
    const total = await col.find(query).count()
    const blocks = await col
      .find(query)
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

  async getRuntime(ctx) {
    let { page, pageSize } = extractPage(ctx)
    page = page - 1
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    const col = await getEventCollection()
    let query = { method: 'CodeUpdated' }
    const keys = {
      hash: 1,
      signer: 1,
      indexer: 1,
      section: 1,
      name: 1,
      isSuccess: 1,
      _id: 0
    }
    const total = await col.countDocuments(query)
    const runtime = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()
    let hashArray = runtime.map(item => item.extrinsicHash)

    const excol = await getExtrinsicCollection()
    let info = []
    let unitquery = {}
    for (let i = 0; i < hashArray.length; i++) {
      unitquery = { hash: hashArray[i] }
      const unit = await excol
        .find(unitquery)
        .project(keys)
        .toArray()
      info.push(...unit)
    }
    ctx.body = {
      info,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new BlockController()
