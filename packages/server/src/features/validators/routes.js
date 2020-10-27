const Router = require('koa-router')
const validatorsController = require('./validator.controller')

const router = new Router()
router.get('/validators', validatorsController.getValidators)
router.get('/unsettled', validatorsController.getUnsettledNodes)
router.get('/trustees', validatorsController.getTrusteeNodes)

module.exports = router
