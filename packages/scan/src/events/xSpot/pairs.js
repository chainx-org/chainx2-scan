const { getPairsCollection } = require('../../mongoClient')
const { logger } = require('../../util')
const safeBlocks = 300

async function removeUselessHistoricalRecords(blockHeight, pairId) {
  const col = await getPairsCollection()
  const records = await col
    .find({
      pairId: pairId,
      blockHeight: { $lt: blockHeight - safeBlocks }
    })
    .toArray()

  if (records.length > 1) {
    const maxSafeHeight = Math.max(...records.map(r => r.blockHeight))
    logger.info(`[orders] pruning the old state before height ${maxSafeHeight}`)
    col.deleteMany({ blockHeight: { $lt: maxSafeHeight } })
  }
}

async function handlePairs(event, indexer) {
  const { blockHeight, blockHash } = indexer

  const json = event.data.toJSON()
  const [{ id: pairId }] = json
  const [pair] = json

  const col = await getPairsCollection()
  await col.insertOne({
    blockHeight,
    blockHash,
    pairId,
    ...pair
  })
  await removeUselessHistoricalRecords(blockHeight, pairId)
}

module.exports = {
  handlePairs
}
