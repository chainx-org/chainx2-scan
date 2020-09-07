const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const {
  getExtrinsicCollection,
  getValidatorsCollection,
  getEventCollection
} = require('../../services/mongo')

class NominationController {
  async getNomination(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    console.log('address:' + ctx.query.address)

    let address = ctx.query.address
    const col = await getExtrinsicCollection()
    const total = await col.estimatedDocumentCount()

    const validatorsCol = await getValidatorsCollection()
    const eventCol = await getEventCollection()

    const nominationList = await col
      .find({ $and: [{ signer: address }, { section: 'xStaking' }] })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()
    const nominationWithValidtorInfo = []
    const validatorList = await validatorsCol.find({}).toArray()

    for (let i = 0; i < nominationList.length; i++) {
      const currentValidator = validatorList.find(
        element => element.account == nominationList[i].args.target
      )
      const data = await eventCol.find({
        extrinsicHash: nominationList[i].hash
      })
      nominationWithValidtorInfo.push({
        key: nominationList[i].hash,
        nominee: '',
        indexer: nominationList[i].indexer,
        vote_account: nominationList[i].signer,
        nomination:
          nominationList[i].name == 'bond' ? nominationList[i].args.value : 0,
        name: nominationList[i].name,
        revocations:
          nominationList[i].name === 'unbond'
            ? nominationList[i].args.value
            : 0,
        last_vote_weight_update: currentValidator.lastTotalVoteWeightUpdate,
        last_vote_weight: currentValidator.lastTotalVoteWeight
      })
    }

    ctx.body = {
      items: nominationWithValidtorInfo,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new NominationController()
