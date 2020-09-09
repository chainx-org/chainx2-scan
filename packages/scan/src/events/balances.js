const { getApi } = require('../api')
const _ = require('lodash')
const BigNumber = require('bignumber.js')
const { getNativeAssetCollection } = require('../mongoClient')

const safeBlocks = 300

async function handleBalancesEvent(event, indexer) {
  const { method } = event
  const { blockHeight, blockHash } = indexer

  if (method === 'Transfer') {
    const [from, to] = event.data.toJSON()

    await updateAddressBalance(blockHeight, blockHash, from)
    if (from !== to) {
      await updateAddressBalance(blockHeight, blockHash, to)
    }
  } else if (method === 'Endowed' || method === 'Reserved') {
    const [account] = event.data.toJSON()

    await updateAddressBalance(blockHeight, blockHash, account)
  }
}

async function updateAddressBalance(blockHeight, blockHash, address) {
  const col = await getNativeAssetCollection()
  const existedRecords = await col.find({ blockHeight, address }).toArray()
  if (existedRecords.length > 0) {
    return
  }

  const asset = await getNativeBalance(address, blockHash)
  await col.insertOne({ blockHeight, address, ...asset })

  const records = await col
    .find({
      address,
      blockHeight: { $lt: blockHeight - safeBlocks }
    })
    .toArray()

  if (records.length > 1) {
    const maxSafeHeight = Math.max(...records.map(r => r.blockHeight))
    await col.deleteMany({ blockHeight: { $lt: maxSafeHeight } })
  }
}

const emptyAsset = {
  free: '0',
  reserved: '0',
  miscFrozen: '0',
  feeFrozen: '0'
}

const emptyStakingLocks = {
  bonded: '0',
  bondedWithdrawal: '0'
}

function normalizeStakingReserved(staking) {
  if (_.isEmpty(staking)) {
    return emptyStakingLocks
  }

  return {
    bonded: staking.Bonded,
    bondedWithdrawal: staking.BondedWithdrawal
  }
}

async function getNativeBalance(address, blockHash) {
  const api = await getApi()
  const asset = await api.query.system.account.at(blockHash, address)
  let data = asset.toJSON().data
  if (_.isEmpty(data)) {
    data = emptyAsset
  }

  const reserve = await api.query.xSpot.nativeReserves.at(blockHash, address)
  data.dexReserved = reserve.toString()

  const staking = await api.query.xStaking.locks(address)
  data.stakingReserved = normalizeStakingReserved(staking.toJSON())

  return Object.entries(data).reduce((result, [key, value]) => {
    if (key === 'stakingReserved') {
      result[key] = value
    } else {
      result[key] = new BigNumber(value).toString()
    }

    return result
  }, {})
}

module.exports = {
  handleBalancesEvent
}
