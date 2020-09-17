const { getDb } = require('../../services/mongo')

class AssetController {
  async getNativeAssetInfo(ctx) {
    const db = await getDb()
    const col = await db.collection('chain')
    const chain = await col.findOne({})

    ctx.body = {
      ...chain.properties
    }
  }

  async getForeignAssetsInfo(ctx) {
    const db = await getDb()
    const col = await db.collection('assets')

    const assets = await col
      .find({})
      .sort({ queryHeight: -1 })
      .limit(1)
      .toArray()
    ctx.body = (assets[0] || {}).assets
  }
}

module.exports = new AssetController()
