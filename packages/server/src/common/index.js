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
    return
  }
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

async function fetchDexReserves(address) {
  if (!address) {
    return
  }
  const api = await getApi()
  const reserve = await api.query.xSpot.nativeReserves(address)
  return reserve.toString()
}

async function fetchNaminationLocks(address) {
  if (!address) {
    return
  }
  const api = await getApi()
  const locks = await api.query.xStaking.locks(address)
  return locks.toJSON()
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
  getBalanceFromAccount,
  fetchDexReserves,
  fetchNaminationLocks
}
