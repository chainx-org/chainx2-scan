const { getDealsCollection } = require('../../mongoClient')

async function handleDeals(event, indexer) {
  const [deal] = event.data.toJSON()

  const col = await getDealsCollection()
  await col.insertOne({
    ...indexer,
    ...deal
  })
}

module.exports = {
  handleDeals
}
