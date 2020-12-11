
const { getDb } = require('../../services/mongo')
const { getApi } = require('../../api')
const { extractPage } = require('../../utils')
const { decodeAddress } = require('../../utils')

class validatorsController {
  async getValidators(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('validators')
    const trust = await db
      .collection('trustees')
      .find({})
      .toArray()
    const trustAddress = trust.map(item => {
      return item.address
    })
    const query = { isValidating: true }
    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ totalNomination: -1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()
    function IsInArray(arr, val) {
      var testStr = ',' + arr.join(',') + ','
      return testStr.indexOf(',' + val + ',') !== -1
    }
    const validatorAddress = items.map(item => {
      return item.account
    })

    /*
    const ecol = await db.collection('event')
    let week = 604800000
    const currentTime = new Date().getTime()
    let startTime = currentTime - week

    let missedArray = []
    for (let i = 0; i < items.length; i++) {
      let equery = {
        $and: [
          { method: 'Slashed' },
          { 'data.0': items[i].account },
          { 'indexer.blockTime': { $gte: startTime } },
          { 'indexer.blockTime': { $lte: currentTime } }
        ]
      }
      let missedItem = await ecol.find(equery).toArray()
      missedArray.push(...missedItem)
    }
    const address = missedArray.map(item => item.data[0])
    function unique(arr) {
      return Array.from(new Set(arr))
    }
    let unitAddress = unique(address)
    const num = address.reduce((obj, name) => {
      if (name in obj) {
        obj[name]++
      } else {
        obj[name] = 1
      }
      return obj
    }, {})
    */
    let newitems = []
    items.map((item, index) => {
      const isTrust = IsInArray(trustAddress, item.account)
      newitems.push(Object.assign({}, item, { isTrust: isTrust }))
      /*
      newitems.push(
        Object.assign({}, item, { isTrust: isTrust }, { weekMissed: 0 })
      )
      let isAddress = IsInArray(unitAddress, item.account)
      if (isAddress) {
        newitems.push(
          Object.assign(
            {},
            item,
            { weekMissed: num[item.account] },
            { isTrust: isTrust }
          )
        )
      }
      */
    })
    ctx.body = {
      newitems,
      page,
      pageSize,
      total
    }
  }

  async getUnsettledNodes(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('validators')

    const query = { isValidating: false }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ totalNomination: -1 })
      .collation({ locale: 'en_US', numericOrdering: true })
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

  async getValidatorInfo(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('validators')

    const query = {}

    const total = await col.countDocuments(query)
    const items = await col.find(query).toArray()
    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }

  async getTrusteeNodes(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('validators')

    const api = await getApi()
    const trusteeListInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()
    const trusteeList = trusteeListInfo.toJSON().trusteeList

    const query = { account: { $in: trusteeList } }

    const total = await col.countDocuments(query)
    const items = await col
      .find(query)
      .sort({ totalNomination: -1 })
      .collation({ locale: 'en_US', numericOrdering: true })
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

  async getMissed(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('event')
    const api = await getApi()

    const query = { section: 'xStaking', method: 'Slashed' }
    const addressInfo = await col
      .find(query)
      .sort({ totalNomination: -1 })
      .collation({ locale: 'en_US', numericOrdering: true })
      .toArray()
    const address = addressInfo.map(item => item.data[0])
    function unique(arr) {
      return Array.from(new Set(arr))
    }
    let unitAddress = unique(address)
    const item = address.reduce((obj, name) => {
      if (name in obj) {
        obj[name]++
      } else {
        obj[name] = 1
      }
      return obj
    }, {})
    const vacol = await db.collection('validators')
    let items = []
    for (let i = 0; i < unitAddress.length; i++) {
      let unit = unitAddress[i]
      let unitquery = { account: unit }
      let nickname = await vacol.find(unitquery).toArray()
      let accountitem = nickname[0].account
      nickname[0].missed = item[accountitem]
      items.push(...nickname)
    }
    items.sort(function(a,b){return a.missed - b.missed})
    items.reverse()
    const total = items.length
    ctx.body = {
      items,
      page,
      pageSize,
      total
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

  async getValidatorVotes(ctx) {
    const db = await getDb()
    const col = await db.collection('event')
    const { page, pageSize } = extractPage(ctx)
    const { address } = ctx.params
    const query = {
      $and: [
        // { method: { $in: ['Bonded', 'Rebonded', 'Unbonded'] } },
        { method: 'Bonded' },
        { 'data.1': address }
      ]
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
}

module.exports = new validatorsController()
