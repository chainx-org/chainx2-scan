const { getDb } = require('../../services/mongo')

class DexController {
  async getPairs(ctx) {
    const db = await getDb()
    const col = await db.collection('pairs')

    const items = await col
      .find({})
      .sort({ blockHeight: -1 })
      .limit(1)
      .toArray()
    ctx.body = items.length <= 0 ? [] : items[0].pairs
  }
  async getTradingPairs(ctx) {
    const db = await getDb()
    const col = await db.collection('deals')
    const items = await col
      .find({})
      .sort()
      .toArray()
    let latestTransactionPrices = 0
    if (items[items.length - 1].price) {
      latestTransactionPrices = items[items.length - 1].price
    }
    let week = 604800000
    let day = 86400000
    const currentTime = new Date().getTime()
    const weekItems = await col
      .find({
        $and: [
          { blockTime: { $gte: currentTime - week } },
          { blockTime: { $lte: currentTime } }
        ]
      })
      .sort()
      .toArray()

    const dayItems = await col
      .find({
        $and: [
          { blockTime: { $gte: currentTime - day } },
          { blockTime: { $lte: currentTime } }
        ]
      })
      .sort()
      .toArray()

    let TransactionsDayNumber = dayItems.reduce(function(total, currentValue) {
      return total + currentValue.turnover
    }, 0)

    let TransactionsWeekNumber = weekItems.length
    ctx.body = {
      latestTransactionPrices,
      TransactionsWeekNumber,
      TransactionsDayNumber
    }
  }
}

module.exports = new DexController()
