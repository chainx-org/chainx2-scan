const { getAssetsCollection } = require('../mongoClient')

async function getAssetInfoById(id) {
  const col = await getAssetsCollection()
  const arr = await col
    .find({ id })
    .sort({ queryHeight: -1 })
    .limit(1)
    .toArray()
  return arr[0]
}

module.exports = {
  getAssetInfoById
}
