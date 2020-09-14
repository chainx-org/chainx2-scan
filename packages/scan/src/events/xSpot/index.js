const { handleOrders } = require('./orders')
const { handleDeals } = require('./deals')

async function handleSpotEvent(event, indexer) {
  const { method } = event

  if (
    [
      'NewOrder',
      'MakerOrderUpdated',
      'TakerOrderUpdated',
      'CanceledOrderUpdated'
    ].includes(method)
  ) {
    await handleOrders(event, indexer)
  } else if (method === 'OrderExecuted') {
    await handleDeals(event, indexer)
  }
}

module.exports = {
  handleSpotEvent
}
