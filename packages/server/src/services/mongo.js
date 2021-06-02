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
  validators: 'validators',
  vote: 'vote',
  orders: 'orders',
  democracy: 'democracy'
}

const transferCollectionName = 'transfer'

let blockCol = null
let extrinsicCol = null
let eventCol = null
let statusCol = null
let accountsCol = null
let transferCol = null
let validatorsCol = null
let voteCol = null
let ordersCol = null
let democracyCol = null
let db = null

async function initDb() {
  console.log(process.env.mongo_url)
  client = await MongoClient.connect(process.env.mongo_url, {
    useUnifiedTopology: true
  })

  db = client.db(dbName)

  blockCol = db.collection(cols.block)
  extrinsicCol = db.collection(cols.extrinsic)
  statusCol = db.collection(cols.status)
  eventCol = db.collection(cols.event)
  accountsCol = db.collection(cols.accounts)
  transferCol = db.collection(transferCollectionName)
  validatorsCol = db.collection(cols.validators)
  voteCol = db.collection(cols.vote)
  ordersCol = db.collection(cols.orders)
  democracyCol = db.collection(cols.democracy)

  return db
}

async function getDb() {
  if (!db) {
    await initDb()
  }

  return db
}

async function tryInit(col) {
  if (!col) {
    await initDb()
  }
}

async function getBlockCollection() {
  await tryInit(blockCol)
  return blockCol
}

async function getExtrinsicCollection() {
  await tryInit(extrinsicCol)
  return extrinsicCol
}

async function getTransferColCollection() {
  await tryInit(transferCol)
  return transferCol
}

async function getValidatorsCollection() {
  await tryInit(validatorsCol)
  return validatorsCol
}

async function getStatusCollection() {
  await tryInit(statusCol)
  return statusCol
}

async function getAccountsCollection() {
  await tryInit(accountsCol)
  return accountsCol
}

async function getEventCollection() {
  await tryInit(eventCol)
  return eventCol
}

async function getVoteCollection() {
  await tryInit(voteCol)
  return voteCol
}

async function getOrdersCollection() {
  await tryInit(ordersCol)
  return ordersCol
}

async function getDemocracyCollection() {
  await tryInit(democracyCol)
  return democracyCol
}

module.exports = {
  initDb,
  getBlockCollection,
  getExtrinsicCollection,
  getEventCollection,
  getStatusCollection,
  getAccountsCollection,
  getTransferColCollection,
  getValidatorsCollection,
  getVoteCollection,
  getOrdersCollection,
  getDemocracyCollection,
  getDb
}
