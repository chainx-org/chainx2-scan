const Router = require('koa-router')
const blockController = require('./orders.controller')

const router = new Router()

router.get('/orders/current',blockController.getCurrentOrders)
router.get('/orders/histort',blockController.getHistoryOrders)

module.exports = router
