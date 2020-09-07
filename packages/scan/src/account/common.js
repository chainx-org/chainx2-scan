const { getApi } = require('../api')
const { sleep, logger } = require('./util')
/**
 *
 * @return  balance { free, reserved, miscFrozen,feeFrozen }
 * */
async function getPCXAssetByAccount(address) {
  if (!address) {
    return
  }
  const api = await getApi()
  const balance = await api.query.system.account(address)
  return balance.data.toJSON()
}

async function getAllAssetByAccount(address) {
  if (!address) {
    return
  }
  const api = await getApi()
  const balance = await api.rpc.xassets.getAssetsByAccount(address)
  return balance.toJSON()
}

module.exports = {
  getPCXAssetByAccount,
  getAllAssetByAccount
}
