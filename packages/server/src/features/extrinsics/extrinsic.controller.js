const { isHash, isNum } = require('../../utils')
const { extractPage } = require('../../utils')
const { getExtrinsicCollection } = require('../../services/mongo')

class ExtrinsicController {
  async getExtrinsics(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { block } = ctx.query
    let query = {}
    if (isHash(block)) {
      query = { 'indexer.blockHash': block }
    } else if (isNum(block)) {
      query = { 'indexer.blockHeight': parseInt(block) }
    }

    const col = await getExtrinsicCollection()
    const total = await col.countDocuments(query)
    // 需要在 mongo shell 里创建 index, db.extrinsic.createIndex({"indexer.blockHeight": -1, "indexer.index": 1})
    const extrinsics = await col
      .find(query)
      .hint({
        'indexer.blockHeight': -1,
        'indexer.index': 1
      })
      // .sort({ 'indexer.blockHeight': -1, 'indexer.index': 1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: extrinsics,
      page,
      pageSize,
      total
    }
  }

  async getExtrinsic(ctx) {
    const { hash } = ctx.params
    if (!isHash(hash)) {
      ctx.status = 400
      return
    }

    const col = await getExtrinsicCollection()
    ctx.body = await col.findOne({ hash })
  }

  async getSudoExtrinsics(ctx) {
    const { page, pageSize } = extractPage(ctx)
    console.log('pagesize', pageSize)

    const query = { section: 'sudo' }
    const keys = {
      hash: 1,
      signer: 1,
      indexer: 1,
      section: 1,
      name: 1,
      'args.call.callIndex': 1,
      isSuccess: 1,
      _id: 0
    }

    const col = await getExtrinsicCollection()
    const total = await col.countDocuments(query)
    const extrinsics = await col
      .find(query)
      .project(keys)
      .sort({ 'indexer.blockHeight': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: extrinsics,
      page,
      pageSize,
      total
    }
  }
  async getSearchExtrinsic(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    let { search } = ctx.params
    search = new RegExp(['^', search, '$'].join(''), 'i')
    const col = await getExtrinsicCollection()
    const totalnum = await col
      .find({ $or: [{ name: search }, { section: search }, { hash: search }] })
      .count()
    const items = await col
      .find({ $or: [{ name: search }, { section: search }, { hash: search }] })
      .collation({ locale: 'en', strength: 2 })
      .sort({ 'indexer.blockHeight': -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items,
      page,
      pageSize,
      totalnum
    }
  }
}

module.exports = new ExtrinsicController()
