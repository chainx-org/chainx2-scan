const { getDb } = require('../../services/mongo')
const { getApi } = require('../../api')
const { extractPage } = require('../../utils')

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
    let newitems = []
    items.map((item, index) => {
      const isTrust = IsInArray(trustAddress, item.account)
      newitems.push(Object.assign({}, item, { isTrust: isTrust }))
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
    let total = 0
    for (let i = 0; i < unitAddress.length; i++) {
      let unit = unitAddress[i]
      let unitquery = { account: unit }
      total = await vacol.countDocuments(unitquery)
      let nickname = await vacol.find(unitquery).toArray()
      let accountitem = nickname[0].account
      nickname[0].missed = item[accountitem]
      items.push(...nickname)
    }

    ctx.body = {
      items,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new validatorsController()
