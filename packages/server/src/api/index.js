const { ApiPromise, WsProvider } = require('@polkadot/api')
const { options } = require('@chainx-v2/api')

let provider = null
let api = null

async function getApi() {
  if (!api) {
    const ws_endpoint = process.env.WS_ENDPOINT
      ? process.env.WS_ENDPOINT
      : // : 'ws://47.114.131.193:9000'
        'ws://47.99.209.200:9000'
    provider = new WsProvider(ws_endpoint)
    api = await ApiPromise.create(options({ provider }))
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
