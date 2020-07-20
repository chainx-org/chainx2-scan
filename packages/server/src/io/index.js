const { latestBlocksRoom, latestExtrinsicsRoom } = require('./constant')
const { feedLatestExtrinsics } = require('./latestExtrinsic')
const { getLatestBlocks, getLatestExtrinsics } = require('../store')
const { feedLatestBlocks } = require('./latestBlock')

module.exports = async io => {
  io.on('connection', function(socket) {
    socket.on('subscribe', room => {
      if (room === latestBlocksRoom) {
        const blocks = getLatestBlocks()
        socket.emit('latestBlocks', blocks)
      }
      if (room === latestExtrinsicsRoom) {
        const extrinsics = getLatestExtrinsics()
        socket.emit('latestExtrinsics', extrinsics)
      }
      socket.join(room)
    })
    socket.on('unsubscribe', room => {
      socket.leave(room)
    })
  })

  await feedLatestBlocks(io)
  await feedLatestExtrinsics(io)
}
