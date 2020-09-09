const { getVoteCollection } = require('../mongoClient')
const BigNumber = require('bignumber.js')
const { getApi } = require('../api')
const _ = require('lodash')
const { logger } = require('../util')

const emptyNominatorLedger = {
  nomination: '0',
  lastVoteWeight: '0',
  lastVoteWeightUpdate: '0'
}

async function getNominatorLedger(blockHash, nominator, nominee) {
  const api = await getApi()
  let nominatorLedger = await api.query.xStaking.nominations.at(
    blockHash,
    nominator,
    nominee
  )

  if (_.isEmpty(nominatorLedger)) {
    nominatorLedger = emptyNominatorLedger
  }

  return Object.entries(nominatorLedger).reduce((result, [key, value]) => {
    /** TODO: also handle unbondedChunks? */
    if (
      ['nomination', 'lastVoteWeight', 'lastVoteWeightUpdate'].includes(key)
    ) {
      result[key] = new BigNumber(value).toString()
    }
    return result
  }, {})
}

async function insertNewNominations(col, blockHeight, nominator, nominations) {
  await col.findOneAndUpdate(
    {
      blockHeight,
      nominator
    },
    {
      $set: {
        blockHeight,
        nominator,
        nominations
      }
    },
    { upsert: true }
  )
}

const historyDepth = 10

async function updateNominatorLedgerAt(
  blockHeight,
  blockHash,
  nominator,
  nominee
) {
  const nominatorLedger = await getNominatorLedger(
    blockHash,
    nominator,
    nominee
  )

  const col = await getVoteCollection()

  const result = await col
    .find({
      nominator
    })
    .toArray()

  if (!result.length) {
    await col.insertOne({
      blockHeight,
      nominator,
      nominations: [{ nominee, nominatorLedger }]
    })
  } else {
    const maxHeight = Math.max(...result.map(r => r.blockHeight))
    const bestResult = await col
      .find({
        blockHeight: maxHeight,
        nominator
      })
      .limit(1)
      .toArray()

    const bestState = bestResult[0]

    /** Remove the existing old nomination of nominee and then push the new one. */
    let newNominations = _.filter(bestState.nominations, function(el) {
      return el.nominee !== nominee
    })
    newNominations.push({
      nominee,
      nominatorLedger
    })

    await insertNewNominations(col, blockHeight, nominator, newNominations)

    /** TODO: optimize the pruning, take finalizedHeight into account. */
    if (blockHeight - historyDepth > 0 && result.length > 1) {
      logger.debug(
        `[vote]pruning the state of ${nominator} older than height ${blockHeight -
          historyDepth}, current history size: ${result.length}`
      )
      // TODO: improve the pruning
      // This deletion can delete all the old state except the new inserted one,
      // so we check the pruned result again and keep the bestState when there is
      // no other history state.
      await col.deleteMany({
        blockHeight: { $lt: blockHeight - historyDepth },
        nominator
      })
      const pruned_result = await col
        .find({
          nominator
        })
        .toArray()
      if (pruned_result.length <= 1) {
        logger.debug(
          `[vote]restore the bestState of ${nominator} at height ${maxHeight}`
        )
        await col.insertOne(bestState)
      }
    }
  }
}

async function handleStakingEvent(event, indexer) {
  const { method } = event
  const { blockHeight, blockHash } = indexer

  if (method === 'Bond' || method === 'Unbond') {
    let [nominator, nominee, value] = event.data.toJSON()
    await updateNominatorLedgerAt(blockHeight, blockHash, nominator, nominee)
  } else if (method === 'Rebond') {
    let [nominator, from, to, value] = event.data.toJSON()
    await updateNominatorLedgerAt(blockHeight, blockHash, nominator, from)
    await updateNominatorLedgerAt(blockHeight, blockHash, nominator, to)
  }
}

module.exports = {
  handleStakingEvent
}
