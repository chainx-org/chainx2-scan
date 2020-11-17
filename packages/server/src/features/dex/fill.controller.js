const { getDb } = require('../../services/mongo')
const { extractPage } = require('../../utils')

class FillController {
  async getFills(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { pairId } = ctx.params

    const db = await getDb()
    const col = await db.collection('deals')

    const query = { pairId: parseInt(pairId) }
    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ executedAt: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()
    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }
  async getKline(ctx) {
    let { pairId, timeCycle } = ctx.params
    let DataItems = []
    const currentTime = new Date().getTime()
    const mod = currentTime % parseInt(timeCycle)

    const db = await getDb()
    const col = await db.collection('deals')

    var endTime
    var startTime
    endTime = currentTime - mod
    startTime = endTime - parseInt(timeCycle)
    let closePrice = []
    let openPrice = []
    let Time = []
    let highPrice = []
    let lowPrice = []
    let volumePrice = []
    for (let i = 0; i < 100; i++) {
      console.log(startTime, 'startTime')
      console.log(endTime, 'endTime')
      Time[i] = startTime

      let query = {
        $and: [
          { pairId: parseInt(pairId) },
          { blockTime: { $gte: startTime } },
          { blockTime: { $lte: endTime } }
        ]
      }

      const result = await col
        .find(query)
        .sort({ executedAt: -1 })
        .toArray()
      DataItems.push(result)
      endTime = startTime
      startTime = startTime - parseInt(timeCycle)
      if (DataItems[i][0]) {
        closePrice[i] = DataItems[i][0].price
        openPrice[i] = DataItems[i][DataItems[i].length - 1].price
        highPrice[i] = Math.max.apply(
          Math,
          DataItems[i].map(function(o) {
            return o.price
          })
        )
        lowPrice[i] = Math.min.apply(
          Math,
          DataItems[i].map(function(o) {
            return o.price
          })
        )
        volumePrice[i] = DataItems[i].reduce(
          (totalPrice, item) => totalPrice + item.price,
          0
        )
      } else {
        closePrice[i] = 0
        openPrice[i] = 0
        highPrice[i] = 0
        lowPrice[i] = 0
        volumePrice[i] = 0
      }
    }
    let items = []
    for (let i = 0; i < DataItems.length; i++) {
      let itemsInfo = {
        time: Time[i],
        close: closePrice[i],
        open: openPrice[i],
        high: highPrice[i],
        low: lowPrice[i],
        volume: volumePrice[i]
      }
      items.push(itemsInfo)
    }
    ctx.body = {
      items
    }
  }
}

module.exports = new FillController()
