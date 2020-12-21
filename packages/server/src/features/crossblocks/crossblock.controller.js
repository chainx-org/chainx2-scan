const { getDb } = require('../../services/mongo')
const { getApi } = require('../../api')
const { extractPage } = require('../../utils')

class crossBlocksController {
  async getCrossBlocks(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('crossBlock')

    const query = {}

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ btcHeight: -1 })
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

  async getCrossTransactions(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()

    /*
    const col = await db.collection('event')

    const query = {
      $or: [
        { $and: [{ section: 'xGatewayBitcoin' }, { method: 'Deposited' }] },
        {
          $and: [
            { section: 'xGatewayRecords' },
            { method: 'WithdrawalFinished' }
          ]
        }
      ]
    }
    */

    const col = await db.collection('crossTransaction')

    const query = {}

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ btcHeight: -1 })
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

  async getCrossDeposits(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('event')

    const query = {
      $and: [{ section: 'xGatewayBitcoin' }, { method: 'Deposited' }]
    }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1 })
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

  async getCrossWithdrawals(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('event')

    const query = {
      $and: [{ section: 'xGatewayRecords' }, { method: 'WithdrawalCreated' }]
    }

    const total = await col.countDocuments(query)
    const events = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    const api = await getApi()
    const withdrawalList = await api.rpc.xgatewayrecords.withdrawalList()
    const keys = Object.keys(withdrawalList.toJSON())

    let items = []
    for (let i = 0; i < events.length; i++) {
      let item = events[i]
      const id = item.data[0]
      let state = ''
      if (keys.length > 0 && keys.includes(id.toString())) {
        state = withdrawalList.toJSON()[id].state || ''
      } else {
        /*
        const query = {
          $and: [
            { method:  { $in: ['WithdrawalProcessed', 'WithdrawalRecovered', 'WithdrawalCanceled', 'WithdrawalFinished', 'WithdrawalProposalVoted' ] } },
            { 'data.0': id }
          ]
        }
        const results = await col
        .find(query)
        .sort({ 'indexer.blockHeight': -1 })
        .toArray()
        state = results[0].method
        */
        // console.log('raw', state)
        // state = raw.toString()
        //const raw = await api.query.xGatewayRecords.withdrawalStateOf(id)
        state = 'Finished'
      }

      /*
      const withdrawalState =
          ? (withdrawalList.toJSON()[items[i].data[0]] ? withdrawalList.toJSON()[items[i].data[0]].state : '')
          : ''
      */
      item['withdrawalState'] = state
      items.push(item)
    }

    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }

  async getCrossTrustees(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('trustees')

    const query = {}

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ threshold: -1 })
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

  async getCrossUnclaim(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('event')

    const query = {
      $and: [{ section: 'xGatewayBitcoin' }, { method: 'UnclaimedDeposit' }]
    }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ btcHeight: -1 })
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

  async getDepositMine(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('depositMine')

    const query = {}

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ assetId: -1 })
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
}

module.exports = new crossBlocksController()
