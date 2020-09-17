const { initPairs } = require('./pairs')

async function init(scanHeight) {
  await initPairs(scanHeight)
}

module.exports = {
  init,
  initPairs
}
