const { getExtrinsicCount } = require('./utils')
const { encodeAddress } = require('./utils')
const { getNativeAsset } = require('./utils')
const { safeAdd } = require('../../utils')
const { getDb } = require('../../services/mongo')
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
    const col = await db.collection('nativeAsset')
    const total = await col.estimatedDocumentCount()
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
    const { address } = ctx.params

    if (!Account.isAddressValid(address)) {
      ctx.body = {
        errMsg: 'illegal address'
      }
      return
    }

    ctx.body = await getNativeAsset(address)
  }
}

module.exports = new AccountsController()
