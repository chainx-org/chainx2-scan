const { getAssetsCollection } = require('../mongoClient')

async function getAssetInfoById(id) {
  const col = await getAssetsCollection()
  const arr = await col
    .find({})
    .sort({ queryHeight: -1 })
    .limit(1)
    .toArray()

  if (arr.length <= 0) {
    throw new Error('find no assets')
  }

  return arr[0].assets.find(asset => asset.id === id)
}

module.exports = {
  getAssetInfoById
}
