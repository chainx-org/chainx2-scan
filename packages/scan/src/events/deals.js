const { getDealsCollection } = require('../mongoClient')
const { logger } = require('../util')
const safeBlocks = 300

async function removeUselessHistoricalRecords(blockHeight, tradingHistoryIdx) {
  const col = await getDealsCollection()
  const records = await col
    .find({
      tradingHistoryIdx: tradingHistoryIdx,
      blockHeight: { $lt: blockHeight - safeBlocks }
    })
    .toArray()

  if (records.length > 1) {
    const maxSafeHeight = Math.max(...records.map(r => r.blockHeight))
    logger.info(`[orders] pruning the old state before height ${maxSafeHeight}`)
    col.deleteMany({ blockHeight: { $lt: maxSafeHeight } })
  }
}

async function handleDealEvent(event, indexer) {
  const { method } = event
  const { blockHeight, blockHash } = indexer
  // create new order
  if (method === 'OrderExecutedInfo') {
    const json = event.data.toJSON()
    const [
      {
        props: { tradingHistoryIdx }
      }
    ] = json

    const [deal] = json

    const col = await getDealsCollection()

    col.insert({
      blockHeight,
      blockHash,
      tradingHistoryIdx,
      ...deal
    })
    await removeUselessHistoricalRecords(blockHeight, tradingHistoryIdx)
  }
}

module.exports = {
  handleDealEvent
}
