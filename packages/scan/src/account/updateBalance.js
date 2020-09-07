const { getAccountsCollection } = require('../mongoClient')
const { getPCXAssetByAccount } = require('./common')

module.exports = async function extractAuthor(extract, from, dest) {
  const col = await getAccountsCollection()
  const fromBalance = await getPCXAssetByAccount(from)
  const destBalnace = await getPCXAssetByAccount(dest)

  // TODO: Improve with bulk operations
  // 更新from转出账户
  await col.findOneAndUpdate(
    { account: from },
    { $set: { balance: fromBalance } },
    { upsert: true }
  )
  // 更新dest转出账户
  await col.findOneAndUpdate(
    { account: dest },
    { $set: { balance: destBalnace } },
    { upsert: true }
  )
}
