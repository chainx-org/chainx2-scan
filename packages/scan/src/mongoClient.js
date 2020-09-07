const { MongoClient } = require('mongodb')
const config = require('../config')
let client = null
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
const orderCollectionName = 'order'

const mainScanName = 'main-scan-height'

let blockCol = null
let extrinsicCol = null
let statusCol = null
let eventCol = null
let assetsCol = null
let validatorsCol = null
let accountsCol = null
let transferCol = null
let voteCol = null
let orderCol = null
let db = null

async function initDb() {
  client = await MongoClient.connect(config.mongo.url)
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
  orderCol = db.collection(orderCollectionName)

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

async function getAccountsCollection() {
  if (!accountsCol) {
    await initDb()
  }
  return accountsCol
}

async function getTransferColCollection() {
  if (!transferCol) {
    await initDb()
  }
  return transferCol
}

async function getOrderColCollection() {
  if (!orderCol) {
    await initDb()
  }
  return orderCol
}

async function getVoteCollection() {
  if (!voteCol) {
    await initDb()
  }
  return voteCol
}

async function getValidatorsCollection() {
  if (!validatorsCol) {
    await initDb()
  }

  return validatorsCol
}

async function getAssetsCollection() {
  if (!assetsCol) {
    await initDb()
  }

  return assetsCol
}

async function getBlockCollection() {
  if (!blockCol) {
    await initDb()
  }
  return blockCol
}

async function getExtrinsicCollection() {
  if (!extrinsicCol) {
    await initDb()
  }
  return extrinsicCol
}

async function getEventCollection() {
  if (!eventCol) {
    await initDb()
  }
  return eventCol
}

async function getStatusCollection() {
  if (!statusCol) {
    await initDb()
  }
  return statusCol
}

// 删除>=给定区块高度的数据
async function deleteDataFrom(blockHeight) {
  if (!blockCol || !extrinsicCol) {
    console.error(`First init db before delete data >= ${blockHeight}`)
    process.exit(1)
  }

  const {
    result: { ok: deleteBlockOk }
  } = await blockCol.deleteMany({ 'header.number': { $gte: blockHeight } })
  const {
    result: { ok: deleteExtrinsicOk }
  } = await extrinsicCol.deleteMany({
    'indexer.blockHeight': { $gte: blockHeight }
  })
  const {
    result: { ok: deleteEventOk }
  } = await eventCol.deleteMany({
    'indexer.blockHeight': { $gte: blockHeight }
  })
  const {
    result: { ok: deleteAssetsOk }
  } = await assetsCol.deleteMany({ queryHeight: { $gte: blockHeight } })

  if (
    deleteBlockOk !== 1 ||
    deleteExtrinsicOk !== 1 ||
    deleteEventOk !== 1 ||
    deleteAssetsOk !== 1
  ) {
    console.error(`Fail to delete data >= ${blockHeight}`)
    process.exit(1)
  }
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
  deleteDataFrom,
  getVoteCollection,
  getOrderColCollection
}
