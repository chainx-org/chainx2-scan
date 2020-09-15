const { safeAdd } = require('../../utils')
const { getDb } = require('../../services/mongo')
const { extractPage } = require('../../utils')

const {
  getBalanceFromAccount,
  fetchDexReserves,
  fetchNaminationLocks
} = require('../../common')

const { getAccountsCollection } = require('../../services/mongo')
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

    // Determine whether the address is legal
    if (!Account.isAddressValid(address)) {
      ctx.body = {
        errmsg: 'illegal address'
      }
      return
    }

    let { PCXBalance } = await getBalanceFromAccount(address)
    let dexReserve = await fetchDexReserves(address)
    let locks = await fetchNaminationLocks(address)

    ctx.body = {
      items: [
        {
          Token: 'PCX',
          Free: PCXBalance ? PCXBalance.free : 0,
          ReservedDexSpot: dexReserve,
          ReservedStakingRevocation:
            JSON.stringify(locks) === '{}' ? 0 : locks.Bonded,
          ReservedStaking:
            JSON.stringify(locks) === '{}' ? 0 : locks.BondedWithdrawal,
          Account: address
        }
      ]
    }
  }
}

module.exports = new AccountsController()
