const { getApi } = require('./api')
const {
  getCrossTrusteesCollection,
  getDepositMineCollection
} = require('./mongoClient')

async function updateTrusteeList(blockHash) {
  const api = await getApi()
  const col = await getCrossTrusteesCollection()
  const trusteeListInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo(
    blockHash
  )
  const json = trusteeListInfo.toJSON()
  const trusteeList = json.trusteeList
  const threshold = json.threshold
  for (let i = 0; i < trusteeList.length; i++) {
    const trustee = trusteeList[i]
    const existEntry = await col.find({ address: trustee }).count()
    if (existEntry < 1) {
      const trusteeInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeProperties(
        trustee
      )
      const name = trusteeInfo.about.toString()
      const hotPubkey = trusteeInfo.hotEntity.toHex()
      const coldPubkey = trusteeInfo.coldEntity.toHex()
      const doc = {
        address: trustee,
        name,
        hotPubkey,
        coldPubkey,
        threshold
      }
      // console.log('trustee info', doc)

      await col.insertOne(doc)
    }
  }
}

async function updateDepositMineInfo(blockHash) {
  const api = await getApi()
  const col = await getDepositMineCollection()
  const depositMineInfo = await api.rpc.xminingasset.getMiningAssets(blockHash)
  const json = depositMineInfo.toJSON()
  for (let i = 0; i < json.length; i++) {
    const assetId = json[i].assetId
    const existEntry = await col.find({ assetId: assetId }).count()
    if (existEntry < 1) {
      const doc = {
        ...json[i]
      }
      await col.insertOne(doc)
    }
  }
}

module.exports = {
  updateTrusteeList,
  updateDepositMineInfo
}
