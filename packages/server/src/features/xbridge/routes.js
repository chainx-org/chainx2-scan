const Router = require('koa-router')
const xbridgeController = require('./xbridge.controller')

const router = new Router()
router.get('/xbridge/issue_requests', xbridgeController.getIssueRquests)
router.get('/xbridge/redeem_requests', xbridgeController.getRedeemRquests)

module.exports = router
