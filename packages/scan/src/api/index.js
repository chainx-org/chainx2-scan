const { ApiPromise, WsProvider } = require('@chainx-v2/api')

let provider = null
let api = null

async function getApi() {
  if (!api) {
    let ws_endpoint
    if (process.env.WS_ENDPOINT) {
      ws_endpoint = process.env.WS_ENDPOINT
    } else {
      ws_endpoint = 'ws://47.114.131.193:9000'
    }
    provider = new WsProvider(ws_endpoint)
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
