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

module.exports = router
