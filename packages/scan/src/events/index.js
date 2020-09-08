const { getOrdersCollection, getVoteCollection } = require('../mongoClient')
const { logger } = require('../util')
const { handleSystemEvent } = require('./system')
const { handleBalancesEvent } = require('./balances')

function getNormalizedOrderFromEvent(event) {
  const order = event.data.toJSON()[0]
  order.props.amount = parseInt(order.props.amount)
  return order
}

async function handleSpotEvent(method, event) {
  if (method === 'PutOrder') {
    const order = getNormalizedOrderFromEvent(event)
    const col = await getOrdersCollection()
    col.insertOne(order)
  } else if (method === 'UpdateOrder') {
    const order = getNormalizedOrderFromEvent(event)
    const col = await getOrdersCollection()
    await col.findOneAndReplace(
      { 'props.id': order.props.id, 'props.submitter': order.props.submitter },
      order,
      { upsert: true }
    )
  }
}

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

async function extractEventBusinessData(event, indexer) {
  const { section, method } = event

  if (section === 'system') {
    await handleSystemEvent(event, indexer)
  } else if (section === 'balances') {
    await handleBalancesEvent(event, indexer)
  } else if (section === 'xSpot') {
    await handleSpotEvent(method, event)
  } else if (section === 'xStaking') {
    await handleStakingEvent(method, event)
  }
}

module.exports = {
  extractEventBusinessData
}
