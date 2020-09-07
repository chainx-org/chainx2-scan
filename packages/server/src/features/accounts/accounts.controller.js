const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const {
  getAccountsCollection,
  getTransferColCollection,
  getExtrinsicCollection,
  getVoteCollection
} = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class AccountsController {
  async getAccounts(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getAccountsCollection()
    const total = await col.estimatedDocumentCount()
    const accounts = await col
      .find({})
      .sort({ 'header.number': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: accounts,
      page,
      pageSize,
      total
    }
  }

  async getAccount(ctx) {
    const { address } = ctx.params
    let query = { account: address }

    const col = await getAccountsCollection()
    let accountsData = await col.findOne(query)
    // 获取交易笔数
    const extrinsicCol = await getExtrinsicCollection()
    let extrinclists = await extrinsicCol.find({ signer: address }).toArray()
    if (accountsData) {
      accountsData.count = extrinclists.length
    } else {
      accountsData = {}
    }

    ctx.body = accountsData
  }

  async getTransaction(ctx) {
    const { address } = ctx.params
    let query = { signer: address }

    const col = await getExtrinsicCollection()
    ctx.body = await col.find(query).toArray()
  }
}

module.exports = new AccountsController()
