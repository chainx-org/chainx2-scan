const Router = require('koa-router')
const blockController = require('./transaction.controller')

const router = new Router()

router.get('/transaction',blockController.getTransaction)

module.exports = router
