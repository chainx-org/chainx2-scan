const { getTransferColCollection } = require('../mongoClient')
const { isExtrinsicSuccess } = require('../events/utils')

module.exports = async function extractUserTransfer(
  extrinsic,
  hash,
  indexer,
  signer,
  args,
  events
) {
  if (!isExtrinsicSuccess(events)) {
    // 交易没有执行成功
    return
  }

  const exCol = await getTransferColCollection()
  const data = {
    indexer,
    extrinsicHash: hash,
    from: signer,
    to: args.dest,
    value: args.value
  }
  const result = await exCol.insertOne(data)
  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
    console.log('插入失败')
  }
}
