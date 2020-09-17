const { getPairsCollection } = require('../mongoClient')
const { getApi } = require('../api')

async function initPairs(scanHeight) {
  if (scanHeight > 10) {
    return
  }

  const api = await getApi()
  const pairs = await api.rpc.xspot.getTradingPairs()

  const json = pairs.toJSON()
  const infoArr = []
  for (const { id } of json) {
    const info = await api.query.xSpot.tradingPairOf(id)
    const pairInfo = info.toJSON()
    infoArr.push({ blockHeight: scanHeight, pairId: id, ...pairInfo })
  }
  const col = await getPairsCollection()
  await col.deleteMany({})
  await col.insertMany(infoArr)
}

module.exports = {
  initPairs
}
