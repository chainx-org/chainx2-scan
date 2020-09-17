const Router = require('koa-router')
const dexController = require('./dex.controller')

const router = new Router()
router.get('/dex/pairs', dexController.getPairs)

module.exports = router
