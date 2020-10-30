const Router = require('koa-router')
const homeController = require('./home.controller')
const router = new Router()
router.get('/home/bitcoinbridge', homeController.getBtcCoinBridgeDeposited)
module.exports = router
