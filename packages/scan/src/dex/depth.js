const { getOrdersCollection } = require('../mongoClient')
const { getPairsCollection } = require('../mongoClient')
const BigNumber = require('bignumber.js')
const { getDepthCollection } = require('../mongoClient')
const { orderEvents } = require('./constants')

async function constructDepth() {
  const pairsCol = await getPairsCollection()
  const [latest] = await pairsCol
    .find({})
    .sort({ blockHeight: -1 })
    .toArray()
  if (!latest) {
    return
  }

  const depthCol = await getDepthCollection()
  await depthCol.deleteMany({})
  const pairIds = latest.pairs.map(p => p.pairId)
  for (const pairId of pairIds) {
    await constructDepthForPair(pairId, true)
    await constructDepthForPair(pairId, false)
  }
}

// ask是卖，bid是买
async function constructDepthForPair(pairId, isAsk = false) {
  const ordersCol = await getOrdersCollection()
  const bids = await ordersCol
    .find({
      'props.pairId': pairId,
      'props.side': isAsk ? 'Sell' : 'Buy',
      status: {
        $ne: 'Canceled'
      }
    })
    .sort({ 'props.price': isAsk ? 1 : -1 })
    .toArray()

  const prices = bids.map(bid => bid.props.price)
  const distinctPrices = [...new Set(prices)]
  const sortedDistinctPrices = distinctPrices.sort()
  if (!isAsk) {
    sortedDistinctPrices.reverse()
  }

  const depthArr = []
  for (const price of sortedDistinctPrices) {
    const targetBids = bids.filter(bid => bid.props.price === price)

    const amount = targetBids.reduce((result, bid) => {
      return new BigNumber(result)
        .plus(bid.props.amount)
        .minus(bid.alreadyFilled)
        .toNumber()
    }, 0)

    depthArr.push({ pairId, price, amount, isAsk })
  }

  const depthCol = await getDepthCollection()
  if (depthArr.length > 0) {
    await depthCol.insertMany(depthArr)
  }
}

async function updateDepthByEvents(events) {
  const hasExchangeEvent = events.some(event =>
    orderEvents.includes(event.event.method)
  )
  if (!hasExchangeEvent) {
    return
  }

  await constructDepth()
}

module.exports = {
  constructDepth,
  updateDepthByEvents
}
