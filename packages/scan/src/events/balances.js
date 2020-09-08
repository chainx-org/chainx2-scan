const { getApi } = require('../api')
const _ = require('lodash')
const BigNumber = require('bignumber.js')
const { getNativeAssetCollection } = require('../mongoClient')

const safeBlocks = 300

async function handleBalancesEvent(event, indexer) {
  const { method } = event
  const { blockHeight } = indexer

  if (method === 'Transfer') {
    const [from, to] = event.data.toJSON()

    await updateAddressBalance(blockHeight, from)
    await updateAddressBalance(blockHeight, to)
  }
}

async function updateAddressBalance(blockHeight, address) {
  const col = await getNativeAssetCollection()
  const asset = await getNativeBalance(address, blockHeight)
  await col.insertOne({ blockHeight, address, ...asset })

  const records = await col
    .find({
      address,
      blockHeight: { $lt: blockHeight - safeBlocks }
    })
    .toArray()

  if (records.length > 1) {
    const minHeight = Math.min(records.map(r => r.blockHeight))
    col.deleteMany({ blockHeight: { $lte: minHeight } })
  }
}

const emptyAsset = {
  free: '0',
  reserved: '0',
  miscFrozen: '0',
  feeFrozen: '0'
}

async function getNativeBalance(address, blockHeight) {
  const api = await getApi()
  const asset = await api.query.system.account.at(blockHeight, address)
  let data = asset.toJSON().data
  if (_.isEmpty(data)) {
    data = emptyAsset
  }
  return Object.entries(data).reduce((result, [key, value]) => {
    result[key] = new BigNumber(value).toString()
    return result
  }, {})
}

module.exports = {
  handleBalancesEvent
}
