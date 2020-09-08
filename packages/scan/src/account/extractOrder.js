const { getOrdersCollection, getEventCollection } = require('../mongoClient')

module.exports = async function extractOrder(
  extrinsic,
  hash,
  indexer,
  name,
  signer,
  args
) {
  const col = await getOrdersCollection()
  const eventCol = await getEventCollection()
  // 查找交易 event事件
  const eventList = await eventCol.find({ extrinsicHash: hash }).toArray()
  // 合并交易结果
  let status = null
  eventList.map(ele => {
    if (ele.method === 'ExtrinsicSuccess') {
      status = ele.method
    }
    if (ele.method === 'ExtrinsicFailed') {
      status = ele.method
    }
  })
  await col.insert({
    indexer,
    signer: signer,
    args: args,
    name: name,
    status: status
  })
}
