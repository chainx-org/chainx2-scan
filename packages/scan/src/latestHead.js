const { getApi } = require('./api')

let latestHeight = null
let unsubscribeNewHead = null

function getUnSubscribeNewHeadFunction() {
  return unsubscribeNewHead
}

async function updateHeight() {
  const api = await getApi()

  unsubscribeNewHead = await api.rpc.chain.subscribeNewHeads(header => {
    latestHeight = header.number.toNumber()
    console.log('latestHeight', latestHeight)
  })
}

function getLatestHeight() {
  return latestHeight
}

module.exports = {
  updateHeight,
  getUnSubscribeNewHeadFunction,
  getLatestHeight
}
