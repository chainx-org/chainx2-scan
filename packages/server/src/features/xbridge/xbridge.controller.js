const { extractPage } = require('../../utils')
const {
  getIssueRequestCollection,
  getRedeemRequestCollection
} = require('../../services/mongo')

class XBridgeController {
  async getIssueRquests(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    let requester = ctx.query.requester
    if (!requester) {
      ctx.status = 400
      return
    }

    const col = await getIssueRequestCollection()
    const total = await col.count({
      requester: requester
    })

    const colList = await col
      .find({ requester: requester })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: colList,
      page,
      pageSize,
      total
    }
    return
  }

  async getRedeemRquests(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    let raw_query = {
      requester: ctx.query.requester,
      vault: ctx.query.vault
    }

    Object.keys(raw_query).forEach(key => {
      if (raw_query[key] === undefined) {
        delete raw_query[key]
      }
    })

    if (!raw_query.requester && !raw_query.vault) {
      ctx.status = 400
      return
    }

    const col = await getRedeemRequestCollection()
    const total = await col.count(raw_query)

    const colList = await col
      .find(raw_query)
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: colList,
      page,
      pageSize,
      total
    }
    return
  }
}

module.exports = new XBridgeController()
