const { getVoteCollection } = require('../mongoClient')
const BigNumber = require('bignumber.js')
const { getApi } = require('../api')
const _ = require('lodash')
const { logger } = require('../util')

function getCurrentVote(col, nominator, nominee) {
  return col
    .find({
      nominator: nominator,
      nominee: nominee
    })
    .limit(1)
    .toArray()
}

async function insertNewVote(col, nominator, nominee, value) {
  await col.findOneAndUpdate(
    {
      nominator: nominator,
      nominee: nominee
    },
    {
      $set: {
        nominator: nominator,
        nominee: nominee,
        value: value
      }
    },
    { upsert: true }
  )
}

async function handleStakingEvent(method, event) {
  if (method === 'Bond') {
    let [nominator, nominee, value] = event.data.toJSON()
    value = parseInt(value)
    const col = await getVoteCollection()
    const result = await getCurrentVote(col, nominator, nominee)
    const new_value = result.length ? value + result[0].value : value
    await insertNewVote(col, nominator, nominee, new_value)
  } else if (method === 'Unbond') {
    let [nominator, nominee, value] = event.data.toJSON()
    value = parseInt(value)
    const col = await getVoteCollection()
    const result = await getCurrentVote(col, nominator, nominee)
    if (!result.length) {
      logger.error(
        `the record of ${nominator} to ${nominee} does not exist, this should not happen`
      )
      return
    }
    const new_value = result[0].value - value
    await insertNewVote(col, nominator, nominee, new_value)
  } else if (method === 'Rebond') {
    let [nominator, from, to, value] = event.data.toJSON()
    value = parseInt(value)
    const col = await getVoteCollection()

    const from_result = await getCurrentVote(col, nominator, from)
    const new_from_value = from_result[0].value - value

    const to_result = await getCurrentVote(col, nominator, to)
    const new_to_value = to_result.length ? value + to_result[0].value : value

    await insertNewVote(col, nominator, from, new_from_value)
    await insertNewVote(col, nominator, to, new_to_value)
  }
}

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

    /** TODO: optimize the pruning, take finalizedHeight into account. */
    await col.deleteMany({ blockHeight: { $lt: maxHeight - 10 }, nominator })

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
  }
}

async function handleStakingEventNew(event, indexer) {
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
  handleStakingEvent,
  handleStakingEventNew
}
