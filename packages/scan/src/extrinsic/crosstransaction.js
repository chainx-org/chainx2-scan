const { getApi } = require('../api')
const { getCrossTransactionCollection } = require('../mongoClient')

async function extractCrossTransaction(events, hash, indexer, signer) {
  const col = await getCrossTransactionCollection()
  const api = await getApi()

  let [crossBtcTxHash, btcBalance, txData] = [null, null, null]

  for (let i = 0; i < events.length; i++) {
    const { event } = events[i]
    // Get tansaction balance from the events at the extrinsic
    if (event.method === 'Deposited' || event.method === 'Withdrawn') {
      crossBtcTxHash = event.data[0].toHex()
      // chainxAccount = event.data[1]
      btcBalance = event.data[2].toNumber()
      txData = event.data.toJSON()
    }
  }

  for (let i = 0; i < events.length; i++) {
    const { event } = events[i]
    if (event.method === 'TxProcessed') {
      const col = await getCrossTransactionCollection()

      const btcTxHash = event.data[0].toHex()
      const btcHash = event.data[1].toHex()
      const txTypeJson = event.data[2].toJSON()
      const txType = txTypeJson.txType

      const chainxTime = indexer.blockTime
      const chainxHash = indexer.blockHash
      const chainxHeight = indexer.blockHeight
      const chainxExtrinsicHash = hash

      // get transaction balance
      let balance = null
      if (btcTxHash === crossBtcTxHash) {
        balance = btcBalance
      }

      const doc = {
        btcTxHash,
        btcHash,
        txType,
        balance,
        chainxHeight,
        chainxExtrinsicHash,
        chainxHash,
        signer,
        chainxTime,
        txData
      }
      // console.log('cross Transaction info', doc)

      await col.insertOne(doc)
    }
  }
}

module.exports = {
  extractCrossTransaction
}
