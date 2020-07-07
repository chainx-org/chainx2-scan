const { getApi } = require('./api');

let latestHeight = null;
let unsubscribeNewHead = null;

async function updateHeight() {
  const api = await getApi();

  unsubscribeNewHead = await api.rpc.chain.subscribeNewHeads(header => {
    latestHeight = header.number.toNumber();
  })
}

function getLatestHeight() {
  return latestHeight
}

module.exports = {
  updateHeight,
  unsubscribeNewHead,
  getLatestHeight
};
