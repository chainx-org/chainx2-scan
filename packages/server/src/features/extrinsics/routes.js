const Router = require('koa-router')
const extrinsicController = require('./extrinsic.controller')

const router = new Router()
router.get('/extrinsics', extrinsicController.getExtrinsics)
router.get('/extrinsics/:hash', extrinsicController.getExtrinsic)
router.get('/sudo_extrinsics', extrinsicController.getSudoExtrinsics)
router.get('/searchExtrinsic/:search', extrinsicController.getSearchExtrinsic)
module.exports = router
