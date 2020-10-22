const { MongoClient } = require('mongodb')
const config = require('../config')

const genesisHeight = 1

const dbName = 'chainx-scan-v2'
const blockCollectionName = 'block'
const extrinsicCollectionName = 'extrinsic'
const eventCollectionName = 'event'
const statusCollectionName = 'status'
const assetsCollectionName = 'assets'
const validatorsCollectionName = 'validators'
const accountsCollectionName = 'accounts'
const transferCollectionName = 'transfer'
const voteCollectionName = 'vote'
const chainCollectionName = 'chain'
const ordersCollectionName = 'orders'
const nativeAssetCollectionName = 'nativeAsset'
const foreignAssetCollectionName = 'foreignAsset'
const pairsCollectionName = 'pairs'
const dealsCollectionName = 'deals'
const depthCollectionName = 'depth'
const crossBlockCollectionName = 'crossBlock'
const crossTransactionCollectionName = 'crossTransaction'
const crossTrusteesCollectionName = 'trustees'
const depositMineCollectionName = 'depositMine'

const mainScanName = 'main-scan-height'

let client = null
let blockCol = null
let extrinsicCol = null
let statusCol = null
let eventCol = null
let assetsCol = null
let validatorsCol = null
let accountsCol = null
let transferCol = null
let voteCol = null
let db = null
let chainCol = null
let ordersCol = null
let nativeAssetCol = null
let foreignAssetCol = null
let pairsCol = null
let dealsCol = null
let depthCol = null
let crossBlockCol = null
let crossTransactionCol = null
let crossTrusteesCol = null
let depositMineCol = null

async function initDb() {
  client = await MongoClient.connect(config.mongo.url, {
    useUnifiedTopology: true
  })

  db = client.db(dbName)

  blockCol = db.collection(blockCollectionName)
  accountsCol = db.collection(accountsCollectionName)
  extrinsicCol = db.collection(extrinsicCollectionName)
  eventCol = db.collection(eventCollectionName)
  statusCol = db.collection(statusCollectionName)
  assetsCol = db.collection(assetsCollectionName)
  validatorsCol = db.collection(validatorsCollectionName)
  transferCol = db.collection(transferCollectionName)
  voteCol = db.collection(voteCollectionName)
  chainCol = db.collection(chainCollectionName)
  ordersCol = db.collection(ordersCollectionName)
  nativeAssetCol = db.collection(nativeAssetCollectionName)
  foreignAssetCol = db.collection(foreignAssetCollectionName)
  pairsCol = db.collection(pairsCollectionName)
  dealsCol = db.collection(dealsCollectionName)
  depthCol = db.collection(depthCollectionName)
  crossBlockCol = db.collection(crossBlockCollectionName)
  crossTransactionCol = db.collection(crossTransactionCollectionName)
  crossTrusteesCol = db.collection(crossTrusteesCollectionName)
  depositMineCol = db.collection(depositMineCollectionName)

  await _createIndexes()
}

async function _createIndexes() {
  if (!db) {
    console.error('Please call initDb first')
    process.exit(1)
  }

  await blockCol.createIndex({ 'header.number': -1 })
  await extrinsicCol.createIndex({
    'indexer.blockHeight': -1,
    'indexer.index': -1
  })
  await eventCol.createIndex({ 'indexer.blockHeight': -1, index: -1 })
}

async function tryInit(col) {
  if (!col) {
    await initDb()
  }
}

async function getDepthCollection() {
  await tryInit(depthCol)
  return depthCol
}

async function getForeignAssetCollection() {
  await tryInit(foreignAssetCol)
  return foreignAssetCol
}

async function getNativeAssetCollection() {
  await tryInit(nativeAssetCol)
  return nativeAssetCol
}

async function getAccountsCollection() {
  await tryInit(accountsCol)
  return accountsCol
}

async function getTransferColCollection() {
  await tryInit(transferCol)
  return transferCol
}

async function getVoteCollection() {
  await tryInit(voteCol)
  return voteCol
}

async function getValidatorsCollection() {
  await tryInit(validatorsCol)
  return validatorsCol
}

async function getAssetsCollection() {
  await tryInit(assetsCol)
  return assetsCol
}

async function getBlockCollection() {
  await tryInit(blockCol)
  return blockCol
}

async function getExtrinsicCollection() {
  await tryInit(extrinsicCol)
  return extrinsicCol
}

async function getEventCollection() {
  await tryInit(eventCol)
  return eventCol
}

async function getStatusCollection() {
  await tryInit(statusCol)
  return statusCol
}

async function getChainCollection() {
  await tryInit(chainCol)
  return chainCol
}

async function getOrdersCollection() {
  await tryInit(ordersCol)
  return ordersCol
}

async function getPairsCollection() {
  await tryInit(pairsCol)
  return pairsCol
}

async function getDealsCollection() {
  await tryInit(dealsCol)
  return dealsCol
}

async function getCrossBlockCollection() {
  await tryInit(crossBlockCol)
  return crossBlockCol
}

async function getCrossTransactionCollection() {
  await tryInit(crossTransactionCol)
  return crossTransactionCol
}

async function getCrossTrusteesCollection() {
  await tryInit(crossTrusteesCol)
  return crossTrusteesCol
}

async function getDepositMineCollection() {
  await tryInit(depositMineCol)
  return depositMineCol
}

// 获取首个扫描区块的高度
async function getFirstScanHeight() {
  const statusCol = await getStatusCollection()
  const heightInfo = await statusCol.findOne({ name: mainScanName })
  if (!heightInfo) {
    return genesisHeight
  } else if (typeof heightInfo.value === 'number') {
    return heightInfo.value + 1
  } else {
    console.error('数据库中扫描高度信息错误!')
    process.exit(1)
  }
}

async function updateScanHeight(height) {
  const statusCol = await getStatusCollection()
  await statusCol.findOneAndUpdate(
    { name: mainScanName },
    { $set: { value: height } },
    { upsert: true }
  )
}

module.exports = {
  getValidatorsCollection,
  getExtrinsicCollection,
  getBlockCollection,
  getStatusCollection,
  getEventCollection,
  getAssetsCollection,
  getAccountsCollection,
  getFirstScanHeight,
  getTransferColCollection,
  updateScanHeight,
  getVoteCollection,
  getChainCollection,
  getOrdersCollection,
  getNativeAssetCollection,
  getForeignAssetCollection,
  getPairsCollection,
  getDealsCollection,
  getDepthCollection,
  getCrossBlockCollection,
  getCrossTransactionCollection,
  getCrossTrusteesCollection,
  getDepositMineCollection
}
