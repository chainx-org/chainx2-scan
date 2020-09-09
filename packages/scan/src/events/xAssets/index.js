const { getApi } = require('../../api')
const { safeBlocks } = require('../../constants')
const { getForeignAssetCollection } = require('../../mongoClient')

async function handleXAssetsEvent(event, indexer) {
  const { method } = event
  const { blockHeight, blockHash } = indexer

  if ('Move' === method) {
    const [, from, , to] = event.data.toJSON()

    await updateAddressBalance(blockHeight, blockHash, from)
    if (from !== to) {
      await updateAddressBalance(blockHeight, blockHash, to)
    }
  } else if (['Issue', 'Set', 'Destory'].includes(method)) {
    const [, accountId] = event.data.toJSON()
    await updateAddressBalance(blockHeight, blockHash, accountId)
  }
}

async function updateAddressBalance(blockHeight, blockHash, address) {
  const col = await getForeignAssetCollection()
  const assets = await getAssetsOfAddress(address, blockHash)

  for (const asset of assets) {
    await col.insertOne({ blockHeight, address, ...asset })

    const records = await col
      .find({
        assetId: asset.assetId,
        address,
        blockHeight: { $lt: blockHeight - safeBlocks }
      })
      .toArray()

    if (records.length > 1) {
      const maxSafeHeight = Math.max(...records.map(r => r.blockHeight))
      await col.deleteMany({
        assetId: asset.assetId,
        address,
        blockHeight: { $lt: maxSafeHeight }
      })
    }
  }
}

async function getAssetsOfAddress(address, blockHash) {
  const api = await getApi()
  const assets = await api.rpc.xassets.getAssetsByAccount(address, blockHash)
  const json = assets.toJSON()

  return Object.keys(json).map(assetId => {
    return {
      assetId,
      details: json[assetId]
    }
  })
}

module.exports = {
  handleXAssetsEvent
}
