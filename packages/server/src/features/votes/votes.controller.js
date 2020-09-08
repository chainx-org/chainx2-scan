const { getVoteCollection } = require('../../services/mongo')

class VotesController {
  async getVotes(ctx) {
    /** TODO: page */
    const voteCol = await getVoteCollection()
    ctx.body = await voteCol.find().toArray()
  }

  async getVotesOf(ctx) {
    const { nominator } = ctx.params
    let query = { nominator: nominator }

    const voteCol = await getVoteCollection()
    ctx.body = await voteCol.find(query).toArray()
  }
}

module.exports = new VotesController()
