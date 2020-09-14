const { getOrdersCollection } = require('../../mongoClient')
const BigNumber = require('bignumber.js')
const { safeBlocks } = require('../../constants')
const { logger } = require('../../util')

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

async function handleOrders(event, indexer) {
  const { blockHeight, blockHash } = indexer

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
}

module.exports = {
  handleOrders
}
