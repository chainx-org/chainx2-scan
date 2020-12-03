const { getDb } = require('../../services/mongo')
const { getEventCollection } = require('../../services/mongo')

class NominationController {
  async getAccountNominations(ctx) {
    const db = await getDb()
    // const col = await db.collection('vote')
    const { address } = ctx.params
    const col = await getEventCollection()
    const query = {
      $and: [
        { method: { $in: ['Bonded', 'Rebonded', 'Unbonded'] } },
        { 'data.0': address }
      ]
    }
    const total = await col.count(query)
    // console.log('total', total)
    const items = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1 })
      //.limit(1)
      .toArray()

    ctx.body = {
      items,
      total
    }
  }
}

module.exports = new NominationController()
