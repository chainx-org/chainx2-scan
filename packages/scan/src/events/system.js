const { getAccountsCollection } = require('../mongoClient')

async function handleSystemEvent(event, indexer) {
  const { method } = event
  const { blockHeight } = indexer
  if (method === 'NewAccount') {
    const address = event.data[0].toJSON()
    const accountCol = await getAccountsCollection()
    await accountCol.insertOne({ blockHeight, address })
  }
}

module.exports = {
  handleSystemEvent
}
