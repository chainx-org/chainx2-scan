const { setLatestBlocks } = require('../store')
const { FEED_INTERVAL } = require('./constant')
const { latestBlocksRoom } = require('./constant')
const { getBlockCollection } = require('../services/mongo')

const blockSize = 10

async function feedLatestBlocks(io, db) {
  try {
    const col = await getBlockCollection()
    const blocks = await col
      .find({})
      .sort({ 'header.number': -1 })
      .limit(blockSize)
      .toArray()

    const simpleBlocks = blocks.map(block => {
      return {
        hash: block.hash,
        number: block.header.number,
        timestamp: block.blockTime,
        extrinsicsCnt: (block.extrinsics || []).length
      }
    })

    if (simpleBlocks.length > 0) {
      io.to(latestBlocksRoom).emit('latestBlocks', simpleBlocks)
      setLatestBlocks(simpleBlocks)
    }
  } catch (e) {
    console.error(e)
  } finally {
    setTimeout(feedLatestBlocks.bind(null, io, db), FEED_INTERVAL)
  }
}

module.exports = {
  feedLatestBlocks
}
