const { ApiPromise, WsProvider } = require('@chainx-v2/api')
const { logger } = require('../util')

let provider = null
let api = null

async function getApi() {
  if (!api) {
    const ws_endpoint = process.env.WS_ENDPOINT
      ? process.env.WS_ENDPOINT
      : 'ws://47.114.131.193:9000'
    provider = new WsProvider(ws_endpoint)
    logger.info('Connecting to Node at ', ws_endpoint)
    api = await ApiPromise.create({ provider })
  }

  return api
}

async function disconnect() {
  if (provider) {
    provider.disconnect()
  }
}

module.exports = {
  getApi,
  disconnect
}
