const { getLatestBlocks } = require('../store')
const { feedLatestBlocks } = require('./latestBlock')
module.exports = async (io, db) => {
  io.on('connection', function(socket) {
    const blocks = getLatestBlocks()
    socket.emit('latestBlocks', blocks)

    socket.on('subscribe', socket.join)
    socket.on('unsubscribe', socket.leave)
  })

  await feedLatestBlocks(io, db)
}
