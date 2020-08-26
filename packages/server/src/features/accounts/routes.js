const Router = require('koa-router')
const blockController = require('./accounts.controller')

const router = new Router()
router.get('/accounts', blockController.getAccounts)
router.get('/accounts/:address', blockController.getAccount)

module.exports = router
