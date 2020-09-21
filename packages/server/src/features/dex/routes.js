const Router = require('koa-router')
const dexController = require('./dex.controller')
const orderController = require('./order.controller')

const router = new Router()
router.get('/dex/pairs', dexController.getPairs)
router.get('/dex/orders', orderController.getOpenOrders)

module.exports = router
