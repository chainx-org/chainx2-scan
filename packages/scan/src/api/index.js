const { ApiPromise } = require('@polkadot/api')
const { WsProvider } = require('@polkadot/rpc-provider')
const { logger } = require('../util')
const definitions = require('../interfaces')

let provider = null
let api = null

async function getApi() {
  if (!api) {
    const types = Object.values(definitions).reduce(
      (res, { types }) => ({ ...res, ...types }),
      {}
    )
    const rpc = Object.values(definitions).reduce(
      (res, { rpc }) => ({ ...res, ...rpc }),
      {}
    )
    const ws_endpoint = process.env.WS_ENDPOINT
      ? process.env.WS_ENDPOINT
      : 'ws://47.114.131.193:9000'
    provider = new WsProvider(ws_endpoint)
    api = await ApiPromise.create({
      provider,
      rpc,
      types
    })
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
