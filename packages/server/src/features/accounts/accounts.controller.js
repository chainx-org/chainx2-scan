const { extractPage } = require('../../utils')
const { getBalanceFromAccount } = require('../../common')

const { getAccountsCollection } = require('../../services/mongo')

class AccountsController {
  async getAccounts(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const col = await getAccountsCollection()
    const total = await col.estimatedDocumentCount()

    const accountsList = await col
      .find({})
      .sort({ 'header.number': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    //TODO 这样查询效率比较低，暂时采取这样的方式，后续再优化
    for (let i = 0; i < accountsList.length; i++) {
      let { pcx, btc, count } = await getBalanceFromAccount(
        accountsList[i].account
      )
      accountsList[i].pcx = pcx
      accountsList[i].btc = btc
      accountsList[i].count = count
    }

    ctx.body = {
      items: accountsList,
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
    let balaceData = await getBalanceFromAccount(address)
    ctx.body = {
      ...accountsData,
      ...balaceData
    }
  }

  //TODO 获取资产信息
  async getAssets(ctx) {}
}

module.exports = new AccountsController()
