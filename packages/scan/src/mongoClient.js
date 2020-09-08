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
let orderCol = null
let db = null
let chainCol = null
let ordersCol = null

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
  chainCol = db.collection(chainCollectionName)
  ordersCol = db.collection(ordersCollectionName)

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

async function getOrInit(col) {
  if (!col) {
    await initDb()
  }
  return col
}

async function getAccountsCollection() {
  return await getOrInit(accountsCol)
}

async function getTransferColCollection() {
  return await getOrInit(transferCol)
}

async function getOrderColCollection() {
  return await getOrInit(orderCol)
}

async function getVoteCollection() {
  return await getOrInit(voteCol)
}

async function getValidatorsCollection() {
  return await getOrInit(validatorsCol)
}

async function getAssetsCollection() {
  return getOrInit(assetsCol)
}

async function getBlockCollection() {
  return await getOrInit(blockCol)
}

async function getExtrinsicCollection() {
  return await getOrInit(extrinsicCol)
}

async function getEventCollection() {
  return await getOrInit(eventCol)
}

async function getStatusCollection() {
  return await getOrInit(statusCol)
}

async function getChainCollection() {
  return await getOrInit(chainCol)
}

async function getOrdersCollection() {
  return await getOrInit(ordersCol)
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
  const {
    result: { ok: deleteAccountsOk }
  } = await accountsCol.deleteMany({ blockHeight: { $gte: blockHeight } })

  if (
    deleteBlockOk !== 1 ||
    deleteExtrinsicOk !== 1 ||
    deleteEventOk !== 1 ||
    deleteAssetsOk !== 1 ||
    deleteAccountsOk !== 1
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
  getChainCollection,
  getOrdersCollection
}
