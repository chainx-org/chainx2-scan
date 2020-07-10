const { MongoClient } = require("mongodb");
const config = require("../../config");
let client = null;

const dbName = "chainx-scan-v2";
const cols = {
  block: "block",
  extrinsic: "extrinsic",
  status: "status"
};

let blockCol = null;
let extrinsicCol = null;
let statusCol = null;

async function initDb() {
  client = await MongoClient.connect(config.mongo.url);
  const db = client.db(dbName);
  blockCol = db.collection(cols.block);
  extrinsicCol = db.collection(cols.extrinsic);
  statusCol = db.collection(cols.status);

  return db;
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

module.exports = {
  initDb,
  getBlockCollection,
  getExtrinsicCollection,
  getStatusCollection
};
