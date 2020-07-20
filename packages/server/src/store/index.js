let latestBlocks = []
let latestExtrinsics = []

function setLatestBlocks(blocks) {
  latestBlocks = blocks
}

function getLatestBlocks() {
  return latestBlocks
}

function setLatestExtrinsics(extrinsics) {
  latestExtrinsics = extrinsics
}

function getLatestExtrinsics() {
  return latestExtrinsics
}

module.exports = {
  setLatestBlocks,
  getLatestBlocks,
  setLatestExtrinsics,
  getLatestExtrinsics
}
