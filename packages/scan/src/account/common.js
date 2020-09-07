const { getApi } = require('../api')

/**
 *
 * @return  balance { free, reserved, miscFrozen,feeFrozen }
 * */
async function getPCXAssetByAccount(address) {
  const api = await getApi()
  const balance = await api.query.system.account(address)
  return balance.data.toJSON()
}

async function getAllAssetByAccount(address) {
  const api = await getApi()
  const balance = await api.rpc.xassets.getAssetsByAccount(address)
  return balance.toJSON()
}

module.exports = {
  getPCXAssetByAccount,
  getAllAssetByAccount
}
