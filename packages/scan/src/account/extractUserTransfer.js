const { getTransferColCollection } = require('../mongoClient')

module.exports = async function extractUserTransfer(
  extrinsic,
  hash,
  indexer,
  signer,
  args
) {
  if (!signer) {
    return
  }
  const exCol = await getTransferColCollection()
  const data = {
    hash: hash,
    blockHeight: indexer.blockHeight,
    blockTime: indexer.blockTime,
    sender: signer,
    receiver: args ? args.dest : '',
    value: args ? args.value : '',
    memo: args ? args.memo : ''
  }
  const result = await exCol.insertOne(data)
  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
    console.log('插入失败')
  }
}
