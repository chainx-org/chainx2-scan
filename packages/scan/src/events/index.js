const { extractAccount } = require('../account')
const { getOrdersCollection, getVoteCollection } = require('../mongoClient')
const { logger } = require('../util')

function getNormalizedOrderFromEvent(event) {
  const order = event.data.toJSON()[0]
  order.props.amount = parseInt(order.props.amount)
  return order
}

async function handleSpotEvents(method, event) {
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
  return new Promise((resolve, reject) => {
    col
      .find({
        nominator: nominator,
        nominee: nominee
      })
      .limit(1)
      .toArray(function(err, data) {
        err ? reject(err) : resolve(data)
      })
  })
}

async function handleStakingEvents(method, event) {
  if (method === 'Bond') {
    let [nominator, nominee, value] = event.data.toJSON()
    value = parseInt(value)

    const col = await getVoteCollection()
    const result = await getCurrentVote(col, nominator, nominee)

    const new_value = result.length ? value + result[0].value : value

    await col.findOneAndUpdate(
      {
        nominator: nominator,
        nominee: nominee
      },
      {
        $set: {
          nominator: nominator,
          nominee: nominee,
          value: new_value
        }
      },
      { upsert: true }
    )
  }
}

async function extractEventBusinessData(event) {
  const { section, method } = event

  if (method === 'NewAccount') {
    const account = event.data.toJSON()
    await extractAccount(account)
  } else if (section === 'xSpot') {
    await handleSpotEvents(method, event)
  } else if (section === 'xStaking') {
    await handleStakingEvents(method, event)
  }
}

module.exports = {
  extractEventBusinessData
}
