const Router = require('koa-router')
const crossBlocksController = require('./crossblock.controller')

const router = new Router()
router.get('/crossblocks/bitcoin/blocks', crossBlocksController.getCrossBlocks)

module.exports = router
