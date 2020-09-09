const { getOrdersCollection } = require('../mongoClient')
const { getApi } = require('../api')

const safeBlocks = 300

async function getOrdersList(submitter, blockHash) {
  const api = await getApi()
  console.log('submitter:' + submitter)
  const orders = await api.rpc.xspot.getOrdersByAccount(submitter, 0, 100)
  return orders
}

async function updateOrdersAt(blockHeight, blockHash, submitter) {
  const orders = await getOrdersList(submitter, blockHash)
  const col = await getOrdersCollection()
  await col.insertOne({
    blockHeight,
    submitter,
    orders: orders.toJSON()
  })

  const records = await col
    .find({
      submitter,
      blockHeight: { $lt: blockHeight - safeBlocks }
    })
    .toArray()

  if (records.length > 1) {
    const maxSafeHeight = Math.max(...records.map(r => r.blockHeight))
    logger.info(`[vote]pruning the old state before height ${maxSafeHeight}`)
    col.deleteMany({ blockHeight: { $lt: maxSafeHeight } })
  }
}

async function handleSpotEvent(event, indexer) {
  const { method } = event
  const { blockHeight, blockHash } = indexer
  // create new order
  if (
    [
      'NewOrder',
      'MakerOrderUpdated',
      'TakerOrderUpdated',
      'OrderExecuted',
      'CanceledOrderUpdated'
    ].includes(method)
  ) {
    console.log(event.data.toJSON().pop())
    let {
      props: { submitter }
    } = event.data.toJSON().pop()
    await updateOrdersAt(blockHeight, blockHash, submitter)
  }
}

module.exports = {
  handleSpotEvent
}
