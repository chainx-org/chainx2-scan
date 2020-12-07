const Router = require('koa-router')
const blockController = require('./block.controller')

const router = new Router()
router.get('/blocks', blockController.getBlocks)
router.get('/blocks/:heightOrHashOrId', blockController.getBlock)
router.get('/blocknum/:params',blockController.getBlockNum)
router.get('/nodeblock/:address',blockController.getNodeBlock)
router.get('/runtimeHistory',blockController.getRuntime)
module.exports = router
