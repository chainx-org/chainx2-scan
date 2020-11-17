const { getApi } = require('./api')
const { getChainCollection } = require('./mongoClient')
const { setSS58Format } = require('@polkadot/util-crypto')
const { Keyring } = require('@polkadot/keyring')

let properties = null
const keyring = new Keyring()

async function updateChainProperties() {
  const api = await getApi()
  const chain = await api.rpc.system.chain()
  const systemProperties = await api.rpc.system.properties()
  properties = systemProperties.toJSON()

  const col = await getChainCollection()
  await col.deleteMany({})
  await col.insertOne({
    chain: chain.toString(),
    properties
  })

  keyring.setSS58Format(properties.ss58Format)
  return systemProperties
}

function getChainProperties() {
  return properties
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

async function getOtherAssetByAccount(address) {
  const api = await getApi()
  const balance = await api.rpc.xassets.getAssetsByAccount(address)
  return balance.toJSON()
}

module.exports = {
  updateChainProperties,
  getOtherAssetByAccount,
  getPCXAssetByAccount,
  getChainProperties
}
