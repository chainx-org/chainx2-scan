const { getAccountsCollection, getEventCollection } = require('../mongoClient')
const { getPCXAssetByAccount, getAllAssetByAccount } = require('./common')

module.exports = async function extractAuthor(extrinsic, hash, from, dest) {
  if (!from) {
    return
  }
  // TODO
}
