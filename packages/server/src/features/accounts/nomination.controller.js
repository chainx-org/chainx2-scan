const { getDb } = require('../../services/mongo')

class NominationController {
  async getAccountNominations(ctx) {
    const db = await getDb()
    const col = await db.collection('vote')

    const { address } = ctx.params
    const [nomination] = await col
      .find({ nominator: address })
      .sort({ blockHeight: -1 })
      .limit(1)
      .toArray()

    ctx.body = nomination ? nomination.nominations : []
  }
}

module.exports = new NominationController()
