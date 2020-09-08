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
  vote: 'vote'
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

async function initDb() {
  client = await MongoClient.connect(config.mongo.url, {
    useUnifiedTopology: true
  })

  const db = client.db(dbName)

  blockCol = db.collection(cols.block)
  extrinsicCol = db.collection(cols.extrinsic)
  statusCol = db.collection(cols.status)
  eventCol = db.collection(cols.event)
  accountsCol = db.collection(cols.accounts)
  transferCol = db.collection(transferCollectionName)
  validatorsCol = db.collection(cols.validators)
  voteCol = db.collection(cols.vote)

  return db
}

async function getOrInit(col) {
  if (!col) {
    await initDb()
  }
  return col
}

async function getBlockCollection() {
  return await getOrInit(blockCol)
}

async function getExtrinsicCollection() {
  return await getOrInit(extrinsicCol)
}

async function getTransferColCollection() {
  return await getOrInit(transferCol)
}

async function getValidatorsCollection() {
  return await getOrInit(validatorsCol)
}

async function getStatusCollection() {
  return await getOrInit(statusCol)
}

async function getAccountsCollection() {
  return await getOrInit(accountsCol)
}

async function getEventCollection() {
  return await getOrInit(eventCol)
}

async function getVoteCollection() {
  return await getOrInit(voteCol)
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
  getVoteCollection
}
