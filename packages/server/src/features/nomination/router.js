const Router = require('koa-router')
const blockController = require('./nomination.controller')

const router = new Router()

router.get('/nomination', blockController.getNomination)

module.exports = router
