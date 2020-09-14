const { getDealsCollection } = require('../../mongoClient')

async function handleDeals(event, indexer) {
  const { blockHeight, blockHash } = indexer
  const [deal] = event.data.toJSON()

  const col = await getDealsCollection()
  col.insertOne({
    blockHeight,
    blockHash,
    ...deal
  })
}

module.exports = {
  handleDeals
}
