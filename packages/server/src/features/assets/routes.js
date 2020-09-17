const Router = require('koa-router')
const assetController = require('./asset.controller')

const router = new Router()
router.get('/native_asset', assetController.getNativeAssetInfo)
router.get('/foreign_asset', assetController.getForeignAssetsInfo)

module.exports = router
