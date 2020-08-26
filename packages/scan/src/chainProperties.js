const { getApi } = require('./api')

async function updateChainProperties() {
  const api = await getApi()
  const chain = await api.rpc.system.chain()
  const systemProperties = await api.rpc.system.properties()
  // TODO: 把chain和properties设置到数据库中

  // const properties = await api.rpc.chain.properties()
  console.log(chain, systemProperties)
}

/**
 *
 * @return  balance { free, reserved, miscFrozen,feeFrozen }
 * */
async function getPCXAssetByAccount(address) {
  const api = await  getApi()
  const balance  = await api.query.system.account(address)
  console.log(balance)
  return  balance.data.toJSON();
}

/**
 *
 * */
async function getOtherAssetByAccount(address) {
  const api = await  getApi()
  const balance  = await api.rpc.xassets.getAssetsByAccount(address)
  console.log(balance)
  return  balance.toJSON();
}

module.exports = {
  updateChainProperties,
  getOtherAssetByAccount,
  getPCXAssetByAccount
}
