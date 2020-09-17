const { updatePairs } = require('../common/updatePair')

async function initPairs(scanHeight) {
  if (scanHeight > 10) {
    return
  }

  await updatePairs(scanHeight)
}

module.exports = {
  initPairs
}
