const { getOrdersCollection } = require('../mongoClient')
const { logger } = require('../util')
const { mapKeys } = require('lodash')
const safeBlocks = 300

async function removeUselessHistoricalRecords(blockHeight, orderId) {
  const col = await getOrdersCollection()
  const records = await col
    .find({
      orderId: orderId,
      blockHeight: { $lt: blockHeight - safeBlocks }
    })
    .toArray()

  if (records.length > 1) {
    const maxSafeHeight = Math.max(...records.map(r => r.blockHeight))
    logger.info(`[orders] pruning the old state before height ${maxSafeHeight}`)
    col.deleteMany({ blockHeight: { $lt: maxSafeHeight } })
  }
}

async function handleSpotEvent(event, indexer) {
  const { method } = event
  const { blockHeight, blockHash } = indexer
  // create new order
  if (method === 'NewOrder') {
    let [{ props }] = event.data.toJSON()

    const col = await getOrdersCollection()
    col.insert({
      blockHeight,
      blockHash,
      orderId: props.id,
      ...event.data.toJSON()
    })
    await removeUselessHistoricalRecords(blockHeight, props.id)
  } else if (
    method === 'MakerOrderUpdated' ||
    method === 'TakerOrderUpdated' ||
    method === 'OrderExecuted' ||
    method === 'CanceledOrderUpdated'
  ) {
    //TODO handler order excute
  }
}

module.exports = {
  handleSpotEvent
}
