const { getOrdersCollection } = require('../mongoClient')

function getNormalizedOrderFromEvent(event) {
  const order = event.data.toJSON()[0]
  order.props.amount = parseInt(order.props.amount)
  return order
}

async function handleSpotEvent(method, event) {
  /** FIXME: Update to the latest Spot Event */
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
