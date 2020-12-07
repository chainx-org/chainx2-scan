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
    const total = await col.estimatedDocumentCount()
    const extrinsics = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1, 'indexer.index': 1 })
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

    const col = await getExtrinsicCollection()
    const total = await col.countDocuments(query)
    const extrinsics = await col
      .find(query)
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
}

module.exports = new ExtrinsicController()
