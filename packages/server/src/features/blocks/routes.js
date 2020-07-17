const Router = require('koa-router')
const blockController = require('./block.controller')

const router = new Router()
router.get('/blocks', blockController.getBlocks)
router.get('/blocks/:heightOrHashOrId', blockController.getBlock)

module.exports = router
