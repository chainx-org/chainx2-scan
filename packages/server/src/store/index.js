let latestBlocks = []
let latestExtrinsics = []
let latestChainStatus = []

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

function setLatestChainStatus(status) {
  latestChainStatus = status
}

function getLatestChainStatus() {
  return latestChainStatus
}

module.exports = {
  setLatestBlocks,
  getLatestBlocks,
  setLatestExtrinsics,
  getLatestExtrinsics,
  setLatestChainStatus,
  getLatestChainStatus
}
