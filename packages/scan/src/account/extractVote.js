const { getVoteCollection } = require('../mongoClient')

module.exports = async function extractUserTransaction(
  extrinsic,
  indexer,
  signer,
  args
) {
  const exCol = await getVoteCollection()
  const data = {
    node: extrinsic.hash.toHex(),
    blockHeight: indexer.blockHeight,
    history: indexer.blockTime,
    account: signer,
    value: args,
    block: args
  }
  const result = await exCol.insertOne(data)
  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
    console.log('插入失败')
  }
}
