const Router = require('koa-router')
const blockController = require('./transfer.controller')

const router = new Router()

router.get('/transfer',blockController.getTransfer)

module.exports = router
