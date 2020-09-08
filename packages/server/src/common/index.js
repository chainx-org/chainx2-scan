const { getApi } = require('../api')
const { getExtrinsicCollection } = require('../services/mongo')
/**
 *
 * @return  balance { free, reserved, miscFrozen,feeFrozen }
 * */
async function getPCXAssetByAccount(address) {
  if (!address) {
    return
  }
  const api = await getApi()
  const balance = await api.query.system.account(address)
  return balance.data.toJSON()
}

async function getBalanceFromAccount(address) {
  if (!address) {
    return {
      pcx: {},
      btc: {},
      count: 0
    }
  }
  //TODO 这样查询效率比较低，暂时采取这样的方式，后续再优化
  const pcxBalance = await getPCXAssetByAccount(address)
  const btcBalance = await getAllAssetByAccount(address)
  // 获取交易笔数
  const extrinsicCol = await getExtrinsicCollection()
  let extrinclists = await extrinsicCol.find({ signer: address }).toArray()

  return {
    pcx: pcxBalance,
    //TODO 目前只有一种资产，所以先不做校验，后续添加下校验
    btc: btcBalance && btcBalance['1'] ? btcBalance['1'] : null,
    count: extrinclists.length
  }
}

async function getAllAssetByAccount(address) {
  if (!address) {
    return
  }
  const api = await getApi()
  const balance = await api.rpc.xassets.getAssetsByAccount(address)
  return balance.toJSON()
}

module.exports = {
  getPCXAssetByAccount,
  getAllAssetByAccount,
  getBalanceFromAccount
}
