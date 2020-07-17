const { feedLatestBlocks } = require('./latestBlock')
module.exports = async (io, db) => {
  io.on('connection', function(socket) {
    socket.on('subscribe', socket.join)
    socket.on('unsubscribe', socket.leave)
  })

  await feedLatestBlocks(io, db)
}
