const { getApi } = require('./api')

async function updateChainProperties() {
  const api = await getApi()
  const chain = await api.rpc.system.chain()
  const systemProperties = await api.rpc.system.properties()
  // TODO: 把chain和properties设置到数据库中

  // const properties = await api.rpc.chain.properties()
  console.log(chain, systemProperties)
}

module.exports = {
  updateChainProperties
}
