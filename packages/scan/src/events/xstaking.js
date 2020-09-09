const { getVoteCollection } = require('../mongoClient')
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

module.exports = {
  handleStakingEvent
}
