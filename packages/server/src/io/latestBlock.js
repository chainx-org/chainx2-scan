const { setLatestBlocks } = require('../store')
const { FEED_INTERVAL } = require('./constant')
const { latestBlocksRoom } = require('./constant')
const { getBlockCollection } = require('../services/mongo')
const { getValidatorsCollection } = require('../services/mongo')
const { encodeAddress } = require('../utils')

const blockSize = 10

async function feedLatestBlocks(io) {
  try {
    const col = await getBlockCollection()
    const blocks = await col
      .find({})
      .sort({ 'header.number': -1 })
      .limit(blockSize)
      .toArray()

    let simpleBlocks = []

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      let simpleblock = {}
      const col = await getValidatorsCollection()
      const encodeAddr = encodeAddress(block.author)
      const validator = await col.findOne({ account: encodeAddr })
      const blockAuthorNickName = validator.referralId || ''
      simpleblock.hash = block.hash
      simpleblock.number = block.header.number
      simpleblock.timestamp = block.blockTime
      simpleblock.extrinsicsCnt = (block.extrinsics || []).length
      simpleblock.author = block.author
      simpleblock.nikename = blockAuthorNickName
      simpleBlocks.push(simpleblock)
    }

    if (simpleBlocks.length > 0) {
      io.to(latestBlocksRoom).emit('latestBlocks', simpleBlocks)
      setLatestBlocks(simpleBlocks)
    }
  } catch (e) {
    console.error(e)
  } finally {
    setTimeout(feedLatestBlocks.bind(null, io), FEED_INTERVAL)
  }
}

module.exports = {
  feedLatestBlocks
}
