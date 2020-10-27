const { getDb } = require('../../services/mongo')
const { getApi } = require('../../api')
const { extractPage } = require('../../utils')

class validatorsController {
  async getValidators(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('validators')

    const query = { isValidating: true }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ lastTotalVoteWeight: -1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }

  async getUnsettledNodes(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('validators')

    const query = { isValidating: false }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ lastTotalVoteWeight: -1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }

  async getTrusteeNodes(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('validators')

    const api = await getApi()
    const trusteeListInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()
    const trusteeList = trusteeListInfo.toJSON().trusteeList

    const query = { account: { $in: trusteeList } }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ lastTotalVoteWeight: -1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new validatorsController()
