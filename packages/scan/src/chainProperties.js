const { getApi } = require('./api')
const { getChainCollection } = require('./mongoClient')
const { setSS58Format } = require('@chainx-v2/crypto')

async function updateChainProperties() {
  const api = await getApi()
  const chain = await api.rpc.system.chain()
  const systemProperties = await api.rpc.system.properties()

  const col = await getChainCollection()
  await col.deleteMany({})
  await col.insertOne({
    chain: chain.toString(),
    properties: systemProperties.toJSON()
  })

  setSS58Format(systemProperties.toJSON().ss58Format)
  return systemProperties
}

/**
 *
 * @return  balance { free, reserved, miscFrozen,feeFrozen }
 * */
async function getPCXAssetByAccount(address) {
  const api = await getApi()
  const balance = await api.query.system.account(address)
  return balance.data.toJSON()
}

/**
 *
 * */
async function getOtherAssetByAccount(address) {
  const api = await getApi()
  const balance = await api.rpc.xassets.getAssetsByAccount(address)
  return balance.toJSON()
}

module.exports = {
  updateChainProperties,
  getOtherAssetByAccount,
  getPCXAssetByAccount
}
