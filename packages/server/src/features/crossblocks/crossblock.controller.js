const { getDb } = require('../../services/mongo')
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
    const col = await db.collection('crossTransaction')

    const query = { txType: 'Deposit' }

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

  async getCrossWithdrawals(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }

    const db = await getDb()
    const col = await db.collection('crossTransaction')

    const query = { txType: 'Deposit' }

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
    const col = await db.collection('crossTransaction')

    const query = { txType: 'Deposit' }

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
