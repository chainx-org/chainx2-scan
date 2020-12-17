const { getApi } = require('../../api')
const { getDb } = require('../../services/mongo')
const { extractPage } = require('../../utils')

class DealController {
  async getDeals(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const { address } = ctx.params

    const db = await getDb()
    const col = await db.collection('deals')

    const query = { $or: [{ maker: address }, { taker: address }] }

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

  async getBalance(ctx) {
    const { account } = ctx.params
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const api = await getApi()
    const db = await getDb()
    const col = await db.collection('status')
    const status = await col.find({}).toArray()

    const lastHeight = status[0].latestHeight
    let HeightArray = []
    const firstHeight = lastHeight % 14400
    HeightArray.push(firstHeight)
    const length = parseInt(lastHeight / 14400)
    for(let i = 1; i < length; i++){
      HeightArray.push(firstHeight + 14400 * i)
    }
    HeightArray.push(lastHeight)

    function group(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    }
    let groupArray = group(HeightArray, 5)
    let now  = groupArray[page]
    let hashArray = []
    for(let i = 0; i < now.length; i++){
      const col = await db.collection('block')
      const hash = await col.find({'header.number': now[i]})
          .toArray()
      hashArray.push(...hash)
    }
    let newHash  = hashArray.map(item=> item.hash)
    let balance = []
    for (let i = 0; i < newHash.length; i ++){
      let scanvalue = await api.query.system.account.at(newHash[i],account)
      balance.push((scanvalue.data.free - scanvalue.data.miscFrozen) / 100000000)
    }
    let data = []
    for (let i= 0; i<now.length; i++){
      data.push({height:now[i], balance: balance[i]})
    }
    ctx.body = {
      data
    }
  }

  async getUnitedMissed(ctx) {
    const api = await getApi()

    const { params } = ctx.params
    let str = params.replace(/[\r\n]/g, '')
    const db = await getDb()
    const col = await db.collection('event')
    const query = { $and: [{ method: 'Slashed' }, { 'data.0': str }] }
    const items = await col.find(query).toArray()
    let itemsHash = items.map(item => item.indexer.blockHash)
    let requestArray = []
    for(let i = 0; i < itemsHash.length; i++){
      requestArray.push(api.query.session.currentIndex.at(itemsHash[i]))
    }
    const data = await Promise.all([
      ...requestArray
    ]);
    for (let i = 0; i<items.length ; i++){
      items[i].session = data[i].words[0]
    }
    ctx.body = {
      items
    }
  }
}

module.exports = new DealController()
