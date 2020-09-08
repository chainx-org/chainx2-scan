const Router = require('koa-router')
const blockController = require('./accounts.controller')
const transferController = require('./transfer.controller')
const transactionController = require('./transaction.controller')

const router = new Router()
router.get('/accounts', blockController.getAccounts)
router.get('/accounts/:address', blockController.getAccount)
router.get('/transaction', transactionController.getTransaction)
router.get('/transfer', transferController.getTransfer)

module.exports = router
