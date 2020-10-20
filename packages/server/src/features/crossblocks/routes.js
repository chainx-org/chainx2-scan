const Router = require('koa-router')
const crossBlocksController = require('./crossblock.controller')

const router = new Router()
router.get('/crossblocks/bitcoin/blocks', crossBlocksController.getCrossBlocks)
router.get(
  '/crossblocks/bitcoin/crosstx',
  crossBlocksController.getCrossTransactions
)
router.get(
  '/crossblocks/bitcoin/deposits',
  crossBlocksController.getCrossDeposits
)
router.get(
  '/crossblocks/bitcoin/withdrawals',
  crossBlocksController.getCrossWithdrawals
)
router.get(
  '/crossblocks/bitcoin/trustees',
  crossBlocksController.getCrossTrustees
)
router.get(
  '/crossblocks/bitcoin/unclaim',
  crossBlocksController.getCrossUnclaim
)

module.exports = router
