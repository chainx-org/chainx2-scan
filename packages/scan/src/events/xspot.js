const { getOrdersCollection } = require('../mongoClient')
const { logger } = require('../util')
const safeBlocks = 300
const BigNumber = require('bignumber.js')

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

function normalizeOrder(order) {
  const {
    props: { amount }
  } = order
  order.props.amount = new BigNumber(amount).toString()
  return order
}

async function handleSpotEvent(event, indexer) {
  const { method } = event
  const { blockHeight, blockHash } = indexer
  // create new order
  if (method === 'NewOrder') {
    const json = event.data.toJSON()
    const [
      {
        props: { id: orderId }
      }
    ] = json
    const [order] = json

    const col = await getOrdersCollection()
    col.insert({
      blockHeight,
      blockHash,
      orderId,
      ...normalizeOrder(order)
    })
    await removeUselessHistoricalRecords(blockHeight, orderId)
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
