const { getVoteCollection } = require('../mongoClient')
const { getApi } = require('../api')
const { logger } = require('../util')

const safeBlocks = 300

async function getNominationsAt(nominator, blockHash) {
  const api = await getApi()
  const nominations = await api.rpc.xstaking.getNominationByAccount(
    nominator,
    blockHash
  )
  return nominations
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
  const nominations = await getNominationsAt(nominator, blockHash)
  const col = await getVoteCollection()
  await col.insertOne({
    blockHeight,
    nominator,
    nominations: nominations.toJSON()
  })

  const records = await col
    .find({
      nominator,
      blockHeight: { $lt: blockHeight - safeBlocks }
    })
    .toArray()

  if (records.length > 1) {
    const maxSafeHeight = Math.max(...records.map(r => r.blockHeight))
    logger.info(`[vote]pruning the old state before height ${maxSafeHeight}`)
    col.deleteMany({ blockHeight: { $lt: maxSafeHeight } })
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
