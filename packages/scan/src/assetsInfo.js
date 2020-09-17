const { getApi } = require('./api')
const { getAssetsCollection } = require('./mongoClient')

async function updateAssetsInfo(height = 0) {
  const api = await getApi()
  const assets = await api.rpc.xassets.getAssets()

  const assetsCol = await getAssetsCollection()
  await assetsCol.deleteMany({ queryHeight: { $lt: height - 100 } }) // 保留前100个块高对应的资产信息
  const assetsInfo = Object.entries(assets.toJSON()).map(([key, asset]) => {
    return {
      id: key,
      ...asset
    }
  })

  const { result } = await assetsCol.insertOne({
    queryHeight: height,
    assets: assetsInfo
  })
  if (!result.ok) {
    // TODO: 处理插入不成功的情况。这里可能产生问题的，因为我们之前已经把这个collection清空了
  }
}

module.exports = {
  updateAssetsInfo
}
