
const { getExtrinsicCount } = require('./utils')
const { encodeAddress } = require('../../utils')
const { getNativeAsset } = require('./utils')
const { safeAdd } = require('../../utils')
const { getDb } = require('../../services/mongo')
const { getApi } = require('../../api')
const { extractPage } = require('../../utils')

const { Account } = require('@chainx-v2/account')

class AccountsController {
  async getAccounts(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('accounts')

    const query = {}

    const total = await col.estimatedDocumentCount(query)

    let items = await col
      .find(query)
      .sort({ blockHeight: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    const api = await getApi()
    let addressArray = []
    for (let i = 0; i < items.length; i++) {
      const addr = items[i].address
      addressArray.push(addr)
    }
    const allAccountInfo = await api.query.system.account.multi(addressArray)
    // console.log('all account info', allAccountInfo)

    /*
    for (let i = 0; i < items.length; i++) {
      const addr = items[i].address
      const accountInfo = await api.query.system.account(addr)
      const json = accountInfo.toJSON()
      items[i].data = json.data
    }
    */

    for (let i = 0; i < items.length; i++) {
      items[i].data = allAccountInfo[i].data
    }

    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
    /*
    const col = await db.collection('nativeAsset')
    // const total = await col.estimatedDocumentCount()
    const accounts = await new Promise((resolve, reject) => {
      col.aggregate(
        [
          { $sort: { blockHeight: -1 } },
          {
            $group: {
              _id: '$address',
              blockHeight: { $first: '$blockHeight' },
              free: { $first: '$free' },
              reserved: { $first: '$reserved' },
              miscFrozen: { $first: '$miscFrozen' },
              feeFrozen: { $first: '$feeFrozen' },
              dexReserved: { $first: '$dexReserved' },
              stakingReserved: { $first: '$stakingReserved' }
            }
          },
          { $sort: { free: -1 } },
          { $skip: page * pageSize },
          { $limit: pageSize }
        ],
        (err, cursor) => {
          if (err) {
            reject(err)
          } else {
            cursor.toArray((err, docs) => {
              if (err) {
                reject(err)
              } else {
                resolve(docs)
              }
            })
          }
        }
      )
    })

    const total = accounts.length

    ctx.body = {
      items: accounts.map(a => ({
        address: a._id,
        ...a,
        total: safeAdd(a.free, a.reserved)
      })),
      page,
      pageSize,
      total
    }
    */
  }

  async getAccount(ctx) {
    const { addressOrId } = ctx.params
    if (!addressOrId) {
      ctx.body = {
        errMsg: 'Invalid address or account id'
      }
      return
    }

    const isAddress = !addressOrId.startsWith('0x')
    if (isAddress && !Account.isAddressValid(addressOrId)) {
      ctx.body = {
        errMsg: 'illegal address or account id'
      }
      return
    }

    const address = isAddress ? addressOrId : encodeAddress(addressOrId)
    const extrinsicCount = await getExtrinsicCount(address)
    const nativeAsset = await getNativeAsset(addressOrId)

    ctx.body = {
      ...nativeAsset,
      extrinsicCount
    }
  }

  //TODO 获取资产信息
  async getAssets(ctx) {
    const { address: addressOrId } = ctx.params
    const isAddress = !addressOrId.startsWith('0x')
    if (isAddress && !Account.isAddressValid(addressOrId)) {
      ctx.body = {
        errMsg: 'illegal address or account id'
      }
      return
    }

    const address = isAddress ? addressOrId : encodeAddress(addressOrId)
    const api = await getApi()
    const accountInfo = await api.query.system.account(address)
    // console.log('account info', accountInfo.toJSON())

    // const assetInfo = await api.rpc.xassets.getAssetsByAccount(address)
    // console.log('foreign asset info', assetInfo.toJSON())

    // ctx.body = await getNativeAsset(address)
    ctx.body = { ...accountInfo }
  }
  //TODO 获取其他资产信息
  async getCrossAssets(ctx) {
    const { address: addressOrId } = ctx.params
    const isAddress = !addressOrId.startsWith('0x')
    if (isAddress && !Account.isAddressValid(addressOrId)) {
      ctx.body = {
        errMsg: 'illegal address or account id'
      }
      return
    }

    const address = isAddress ? addressOrId : encodeAddress(addressOrId)
    const api = await getApi()
    const accountInfo = await api.rpc.xassets.getAssetsByAccount(address)
    const accountInfoJSON = accountInfo.toJSON()
    ctx.body = [accountInfoJSON]
  }

  async getAccountType(ctx) {
    const { address } = ctx.params
    const db = await getDb()
    const validatorCol = await db.collection('validators')
    const api = await getApi()
    const trusteeListInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()
    const trusteeList = trusteeListInfo.toJSON().trusteeList
    const trustQuery = { account: { $in: trusteeList } }
    const trustItems = await validatorCol
        .find(trustQuery)
        .sort({ totalNomination: -1 })
        .collation({ locale: 'en_US', numericOrdering: true })
        .toArray()
    const unsettledQuery = { isValidating: false }
    const unsettledItems = await validatorCol
        .find(unsettledQuery)
        .sort({ totalNomination: -1 })
        .collation({ locale: 'en_US', numericOrdering: true })
        .toArray()

    // 获取验证节点
    const trustees = await db
        .collection('trustees')
        .find({})
        .toArray()
    const trustAddress = trustees.map(item => {
      return item.address
    })
    const query = { isValidating: true }
    const items = await validatorCol
        .find(query)
        .sort({ totalNomination: -1 })
        .collation({ locale: 'en_US', numericOrdering: true })
        .toArray()
    function IsInArray(arr, val) {
      var testStr = ',' + arr.join(',') + ','
      return testStr.indexOf(',' + val + ',') !== -1
    }
    const validatorAddress = items.map(item => {
      return item.account
    })

    let valiadtorList = []
    items.map((item, index) => {
      const isTrust = IsInArray(trustAddress, item.account)
      valiadtorList.push(Object.assign({}, item, { isTrust: isTrust }))
    })
    let validator = false
    for (let i = 0; i < valiadtorList.length; i++) {
      const item = valiadtorList[i]
      if (item) {
        if (item.account === address) {
          validator = true
        }
      }
    }
    let unsettled = false
    let trust = false
    for (let i = 0; i < trustItems.length; i++) {
      const item = trustItems[i]
      if (item) {
        if (item.account === address) {
          trust = true
        }
      }
    }
    for (let i = 0; i < unsettledItems.length; i++) {
      const item = unsettledItems[i]
      if (item) {
        if (item.account === address) {
          unsettled = true
        }
      }
    }
    let data = {
      trust,
      unsettled,
      validator
    }
    ctx.body = {
      data
    }
  }
}

module.exports = new AccountsController()
