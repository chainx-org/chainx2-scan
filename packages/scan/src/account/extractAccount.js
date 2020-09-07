const { getPCXAssetByAccount, getAllAssetByAccount } = require('./common')
const { getAccountsCollection } = require('../mongoClient')
const { Account } = require('@chainx-v2/account')

module.exports = async function extractAccont(account) {
  const exCol = await getAccountsCollection()
  const address = account[0]
  const pcxBalance = await getPCXAssetByAccount(address)
  const otherBalance = await getAllAssetByAccount(address)

  // Todo 合并dex数据，投票资产数据
  const data = {
    account: address,
    pcx: pcxBalance,
    btc: otherBalance && otherBalance['1'] ? otherBalance['1'] : null,
    publickey: Account.decodeAddress(address)
  }
  const result = await exCol.insertOne(data)
  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
    console.log('插入失败')
  }
}
