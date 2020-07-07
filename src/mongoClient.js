const { MongoClient } = require('mongodb');
const config = require('../config');
let client = null;
const genesisHeight = 0;

const dbName = 'chainx-scan-v2';
const blockCollectionName = 'block';
const extrinsicCollectionName = 'extrinsic';
const statusCollectionName = 'status';

const mainScanName = 'main-scan-height';

let blockCol = null;
let extrinsicCol = null;
let statusCol = null;

async function initDb() {
  client = await MongoClient.connect(config.mongo.url);
  const db = client.db(dbName);
  blockCol = db.collection(blockCollectionName);
  extrinsicCol = db.collection(extrinsicCollectionName);
  statusCol = db.collection(statusCollectionName);
}

async function getBlockCollection() {
  if (!blockCol) {
    await initDb();
  }
  return blockCol;
}

async function getExtrinsicCollection() {
  if (!extrinsicCol) {
    await initDb();
  }
  return extrinsicCol;
}

async function getStatusCollection() {
  if (!statusCol) {
    await initDb();
  }
  return statusCol;
}

async function getFirstScanHeight() {
  const statusCol = await getStatusCollection();
  const heightInfo = await statusCol.findOne({ name: mainScanName });
  return heightInfo ? heightInfo.height + 1 : genesisHeight;
}

async function updateScanHeight(height) {
  const statusCol = await getStatusCollection();
  await statusCol.findOneAndUpdate({ name: mainScanName }, { $set: { value: height } }, { upsert: true })
}

module.exports = {
  getExtrinsicCollection,
  getBlockCollection,
  getStatusCollection,
  getFirstScanHeight,
  updateScanHeight
};
