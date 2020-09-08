const { extractPage } = require('../../utils')
const { getBalanceFromAccount } = require('../../common')
const { getAccountsCollection } = require('../../services/mongo')
const { Account } = require('@chainx-v2/account')

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

    //TODO Such query efficiency is relatively low, take this way for the time being, and then optimize
    for (let i = 0; i < accountsList.length; i++) {
      let { pcx, btc, count } = await getBalanceFromAccount(
        accountsList[i].address
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
    let query = { address: address }
    if (!Account.isAddressValid(address)) {
      ctx.body = {
        errmsg: 'illegal address'
      }
      return
    }
    const col = await getAccountsCollection()
    let accountsData = await col.findOne(query)
    let balaceData = await getBalanceFromAccount(address)
    const publickey = Account.decodeAddress(address)
    ctx.body = {
      ...accountsData,
      ...balaceData,
      publickey
    }
  }

  //TODO 获取资产信息
  async getAssets(ctx) {
    const { address } = ctx.params
    let query = { account: address }
    // Determine whether the address is legal
    if (!Account.isAddressValid(address)) {
      ctx.body = {
        errmsg: 'illegal address'
      }
      return
    }

    let { pcx } = await getBalanceFromAccount(address)

    ctx.body = {
      Free: pcx.free
    }
  }
}

module.exports = new AccountsController()
