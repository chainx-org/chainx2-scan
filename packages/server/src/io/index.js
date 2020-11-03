const {
  latestBlocksRoom,
  latestExtrinsicsRoom,
  latestChainStatusRoom
} = require('./constant')
const {
  getLatestBlocks,
  getLatestExtrinsics,
  getLatestChainStatus
} = require('../store')
const { feedLatestExtrinsics } = require('./latestExtrinsic')
const { feedLatestChainStatus } = require('./latestChainStatus')
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
      if (room === latestChainStatusRoom) {
        const status = getLatestChainStatus()
        socket.emit('latestChainStatus', status)
      }
      socket.join(room)
    })
    socket.on('unsubscribe', room => {
      socket.leave(room)
    })
  })

  await feedLatestBlocks(io)
  await feedLatestExtrinsics(io)
  await feedLatestChainStatus(io)
}
