const { ApiPromise, WsProvider } = require('@polkadot/api');
const types = require('./chainx-types');
const rpc = require('./chainx-rpc');

let api = null;

async function getApi() {
  if (!api) {
    // TODO: config url from env variable
    const provider = new WsProvider('ws://47.114.131.193:9000');
    api = await ApiPromise.create({ provider, types, rpc });
  }

  return api;
}

module.exports = {
  getApi
};
