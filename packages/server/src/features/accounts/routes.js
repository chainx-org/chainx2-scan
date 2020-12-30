const Router = require('koa-router')
const accountsController = require('./accounts.controller')
const transferController = require('./transfer.controller')
const transactionController = require('./transaction.controller')
const nominationController = require('./nomination.controller')
const orderController = require('./order.controller')
const dealController = require('./deal.controller')
const depositsController = require('./deposits.controller')
const withdrawalsController = require('./withdrawals.controller')

const router = new Router()
router.get('/accounts', accountsController.getAccounts)
router.get('/accounts/:addressOrId', accountsController.getAccount)

router.get('/accounts/:address/assets', accountsController.getAssets)
router.get('/accounts/:address/crossassets', accountsController.getCrossAssets)
router.get('/accounts/:address/transfers', transferController.accountTransfers)
router.get(
  '/accounts/:address/votes',
  nominationController.getAccountNominations
)
router.get(
  '/accounts/:address/extrinsics',
  transactionController.getAccountExtrinsics
)
router.get(
  '/accounts/:address/open_orders',
  orderController.getAccountOpenOrders
)
router.get('/accounts/:address/deals', dealController.getDeals)

router.get('/transaction', transactionController.getTransaction)
router.get('/transfer', transferController.getTransfer)
router.get('/accounts/:address/deposits', depositsController.getDeposits)
router.get(
  '/accounts/:address/withdrawals',
  withdrawalsController.getWithdrawals
)
router.get('/accounts/balance/:account', accountsController.getBalanceHistory)
router.get('/accountType/:address', accountsController.getAccountType)

module.exports = router
