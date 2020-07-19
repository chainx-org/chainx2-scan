let latestBlocks = []

function setLatestBlocks(blocks) {
  latestBlocks = blocks
}

function getLatestBlocks() {
  return latestBlocks
}

module.exports = {
  setLatestBlocks,
  getLatestBlocks
}
