const {
  getExtrinsicCollection,
  getAccountsCollection
} = require('../mongoClient')
const { signerPlaceHolder } = require('../constants')

module.exports = async function updateTransactionCount(signer) {
  if (signer === signerPlaceHolder) {
    return
  }
  const exCol = await getExtrinsicCollection()
  const accountCol = await getAccountsCollection()

  const transactions = await exCol.find({ signer: signer }).toArray()
  let count = transactions ? transactions.length : 0
  // 更新账户交易数
  const result = await accountCol.findOneAndUpdate(
    { account: signer },
    { $set: { count: count } },
    { upsert: true }
  )

  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
    console.log('插入失败')
  }
}
