// 删除>=给定区块高度的数据
const { getAccountsCollection } = require('../mongoClient')
const { getPairsCollection } = require('../mongoClient')
const { getOrdersCollection } = require('../mongoClient')
const { getDealsCollection } = require('../mongoClient')
const { getTransferColCollection } = require('../mongoClient')
const { getAssetsCollection } = require('../mongoClient')
const { getEventCollection } = require('../mongoClient')
const { getExtrinsicCollection } = require('../mongoClient')
const { getBlockCollection } = require('../mongoClient')
const { getNativeAssetCollection } = require('../mongoClient')

async function rollbackEvents(blockHeight) {
  const eventCol = await getEventCollection()
  await eventCol.deleteMany({ 'indexer.blockHeight': { $gte: blockHeight } })

  // TODO: handle rollback business logic
}

async function deleteDataFrom(blockHeight) {
  const blockCol = await getBlockCollection()
  await blockCol.deleteMany({ 'header.number': { $gte: blockHeight } })

  const extrinsicCol = await getExtrinsicCollection()
  await extrinsicCol.deleteMany({
    'indexer.blockHeight': { $gte: blockHeight }
  })

  await rollbackEvents(blockHeight)

  const assetsCol = await getAssetsCollection()
  await assetsCol.deleteMany({ queryHeight: { $gte: blockHeight } })

  const accountsCol = await getAccountsCollection()
  await accountsCol.deleteMany({ blockHeight: { $gte: blockHeight } })

  const transferCol = await getTransferColCollection()
  await transferCol.deleteMany({ 'indexer.blockHeight': { $gte: blockHeight } })

  const nativeAssetCol = await getNativeAssetCollection()
  await nativeAssetCol.deleteMany({ blockHeight: { $gte: blockHeight } })

  const dealsCol = await getDealsCollection()
  await dealsCol.deleteMany({ blockHeight: { $gte: blockHeight } })

  const ordersCol = await getOrdersCollection()
  await ordersCol.deleteMany({ blockHeight: { $gte: blockHeight } })

  const pairsCol = await getPairsCollection()
  await pairsCol.deleteMany({ blockHeight: { $gte: blockHeight } })
}

module.exports = {
  deleteDataFrom
}
