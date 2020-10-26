const Router = require('koa-router')
const validatorsController = require('./validator.controller')

const router = new Router()
router.get('/validators', validatorsController.getValidators)
/*
router.get(
  '/crossblocks/bitcoin/trustees',
  crossBlocksController.getCrossTrustees
)
router.get(
  '/crossblocks/bitcoin/unclaim',
  crossBlocksController.getCrossUnclaim
)
*/

module.exports = router
