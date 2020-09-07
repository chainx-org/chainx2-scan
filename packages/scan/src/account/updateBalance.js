const { getAccountsCollection, getEventCollection } = require('../mongoClient')
const { getPCXAssetByAccount, getAllAssetByAccount } = require('./common')

module.exports = async function extractAuthor(extrinsic, hash, from, dest) {
  if (!from) {
    return
  }
  const accountCol = await getAccountsCollection()
  const eventCol = await getEventCollection()
  // 获取PCX 资产
  const fromBalance = await getPCXAssetByAccount(from)
  const destBalnace = await getPCXAssetByAccount(dest)
  // 获取其余资产
  const otherFrom = await getAllAssetByAccount(from)
  const otherDest = await getAllAssetByAccount(dest)

  // 更新from转出账户
  await accountCol.findOneAndUpdate(
    { account: from },
    { $set: { pcx: fromBalance } },
    { $set: { btc: otherFrom && otherFrom['1'] ? otherFrom['1'] : null } },
    { upsert: true }
  )

  await accountCol.findOneAndUpdate(
    { account: dest },
    { $set: { pcx: destBalnace } },
    { $set: { btc: otherDest && otherDest['1'] ? otherDest['1'] : null } },
    { upsert: true }
  )
}
