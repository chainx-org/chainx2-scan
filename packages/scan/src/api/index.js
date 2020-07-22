const { ApiPromise, WsProvider } = require('@polkadot/api')
const types = require('./chainx-types')
const rpc = require('./chainx-rpc')

let provider = null
let api = null

async function getApi() {
  if (!api) {
    // TODO: config url from env variable
    provider = new WsProvider('ws://47.114.131.193:9000')
    api = await ApiPromise.create({ provider, types, rpc })
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
