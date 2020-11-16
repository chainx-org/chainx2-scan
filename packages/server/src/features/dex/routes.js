const Router = require('koa-router')
const dexController = require('./dex.controller')
const orderController = require('./order.controller')
const fillController = require('./fill.controller')
const handicapController = require('./handicap.controller')
const depthController = require('./depth.controller')

const router = new Router()
router.get('/dex/pairs', dexController.getPairs)
router.get('/dex/orders', orderController.getOpenOrders)
router.get('/dex/open_orders/:pairId', orderController.getPairOpenOrders)
router.get('/dex/fills/:pairId', fillController.getFills)
router.get('/dex/handicap/:pairId', handicapController.getHandicap)
router.get('/dex/depth/:pairId', depthController.getDepth)
router.get(
  '/dex/account_orders/:address/:pairId',
  orderController.getAccountOpenOrders
)
router.get('/dex/kline/:pairId/:timeCycle', fillController.getKline)

module.exports = router
