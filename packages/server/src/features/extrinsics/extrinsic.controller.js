const { isHash } = require('../../utils')
const { extractPage } = require('../../utils')
const { getExtrinsicCollection } = require('../../services/mongo')

class ExtrinsicController {
  async getExtrinsics(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getExtrinsicCollection()
    const total = await col.estimatedDocumentCount()
    const extrinsics = await col
      .find({})
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
}

module.exports = new ExtrinsicController()
