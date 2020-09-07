const { MongoClient } = require('mongodb')
const config = require('../../config')
let client = null

const dbName = 'chainx-scan-v2'
const cols = {
  block: 'block',
  extrinsic: 'extrinsic',
  status: 'status',
  event: 'event',
  accounts: 'accounts',
  validators: 'validators'
}

const transferCollectionName = 'transfer'

let blockCol = null
let extrinsicCol = null
let eventCol = null
let statusCol = null
let accountsCol = null
let transferCol = null
let validatorsCol = null

async function initDb() {
  client = await MongoClient.connect(config.mongo.url)
  const db = client.db(dbName)
  blockCol = db.collection(cols.block)
  extrinsicCol = db.collection(cols.extrinsic)
  statusCol = db.collection(cols.status)
  eventCol = db.collection(cols.event)
  accountsCol = db.collection(cols.accounts)
  transferCol = db.collection(transferCollectionName)
  validatorsCol = db.collection(cols.validators)

  return db
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

async function getTransferColCollection() {
  if (!transferCol) {
    await initDb()
  }
  return transferCol
}

async function getValidatorsCollection() {
  if (!validatorsCol) {
    await initDb()
  }
  return validatorsCol
}

async function getStatusCollection() {
  if (!statusCol) {
    await initDb()
  }
  return statusCol
}

async function getAccountsCollection() {
  if (!accountsCol) {
    await initDb()
  }
  return accountsCol
}

async function getEventCollection() {
  if (!eventCol) {
    await initDb()
  }
  return eventCol
}

module.exports = {
  initDb,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getStatusCollection,
  getAccountsCollection,
  getTransferColCollection,
  getValidatorsCollection
}
