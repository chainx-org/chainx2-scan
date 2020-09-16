const Router = require('koa-router')
const blockController = require('./accounts.controller')
const transferController = require('./transfer.controller')
const transactionController = require('./transaction.controller')
const nominationController = require('./nomination.controller')

const router = new Router()
router.get('/accounts', blockController.getAccounts)
router.get('/accounts/:addressOrId', blockController.getAccount)

router.get('/accounts/:address/assets', blockController.getAssets)
router.get('/accounts/:address/transfers', transferController.accountTransfers)
router.get(
  '/accounts/:address/votes',
  nominationController.getAccountNominations
)
router.get(
  '/accounts/:address/extrinsics',
  transactionController.getAccountExtrinsics
)

router.get('/transaction', transactionController.getTransaction)
router.get('/transfer', transferController.getTransfer)

module.exports = router
