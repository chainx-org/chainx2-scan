const { getVoteCollection } = require('../mongoClient')
const { getApi } = require('../api')
const { logger } = require('../util')

const safeBlocks = 300

async function getNominationsAt(nominator, blockHash) {
  const api = await getApi()
  return await api.rpc.xstaking.getNominationByAccount(nominator, blockHash)
}

async function updateNominationsAt(blockHeight, blockHash, nominator) {
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

  if (['Bonded', 'Unbonded', 'Rebonded'].includes(method)) {
    let [nominator] = event.data.toJSON()
    await updateNominationsAt(blockHeight, blockHash, nominator)
  }
}

module.exports = {
  handleStakingEvent
}
