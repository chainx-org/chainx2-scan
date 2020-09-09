const { getOrdersCollection } = require('../mongoClient')
const { logger } = require('../util')
const { mapKeys } = require('lodash')
const safeBlocks = 300

async function handleRollbackBlock(blockHeight, orderId) {
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
    let [
      { props, status, remaining, executedIndices, alreadyFilled, lastUpdateAt }
    ] = event.data.toJSON()
    props = mapKeys(props, (value, key) => {
      if (key === 'id') return 'orderId'
      else {
        return key
      }
    })
    const col = await getOrdersCollection()
    col.insert({
      blockHeight,
      blockHash,
      status,
      remaining,
      executedIndices,
      alreadyFilled,
      lastUpdateAt,
      ...props
    })
    handleRollbackBlock(blockHeight, props.orderId)
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
