const { getPairsCollection } = require('../mongoClient')
const { getApi } = require('../api')

async function updatePairs(blockHeight, blockHash) {
  const api = await getApi()
  const pairs = await api.rpc.xspot.getTradingPairs()

  const json = pairs.toJSON()
  const infoArr = []
  for (const { id } of json) {
    const info = await api.query.xSpot.tradingPairOf(id)
    const pairInfo = info.toJSON()
    infoArr.push({ pairId: id, ...pairInfo })
  }

  const info = { blockHeight: blockHeight, pairs: infoArr }
  const col = await getPairsCollection()
  await col.deleteMany({})
  await col.insertOne(info)
}

module.exports = {
  updatePairs
}
