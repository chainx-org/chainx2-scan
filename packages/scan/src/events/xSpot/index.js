const { handleOrders } = require('./orders')
const { handleDeals } = require('./deals')
const { handlePairs } = require('./pairs')

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
  } else if (['TradingPairAdded', 'TradingPairUpdated'].includes(method)) {
    await handlePairs(event, indexer)
  }
}

module.exports = {
  handleSpotEvent
}
