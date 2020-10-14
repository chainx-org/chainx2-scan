const { getApi } = require('../api')
const { getCrossBlockCollection } = require('../mongoClient')

async function extractCrossBlock(events, hash, indexer, signer) {
  const col = await getCrossBlockCollection()
  const api = await getApi()

  for (let i = 0; i < events.length; i++) {
    const { event } = events[i]
    if (event.method === 'InsertHeader') {
      const btcHash = event.data[0].toHex()
      const btcHeaderInfo = await api.query.xGatewayBitcoin.headers(btcHash)
      const json = btcHeaderInfo.toJSON()
      // console.log('btc header json', json)

      // TODO: 使用bitcoinjs反序列化header里的bytes，得到header里的信息
      const btcHeaderBytes = json.header
      // const btcTime = json.header.time
      // const nonce = json.header.nonce

      const btcHeight = json.height

      const chainxTime = indexer.blockTime
      const chainxHash = indexer.blockHash
      const chainxExtrinsicHash = hash

      const doc = {
        btcHeight,
        btcHash,
        btcHeaderBytes,
        chainxHash,
        chainxExtrinsicHash,
        signer,
        chainxTime
      }
      await col.insertOne(doc)
    }
  }
}

module.exports = {
  extractCrossBlock
}
