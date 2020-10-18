const Router = require('koa-router')
const democracyController = require('./democracy.controller')

const router = new Router()
router.post('/democracy/submit_democracy', democracyController.submitDemocracy)
router.get('/democracy/get_democracy', democracyController.getDemocracy)

module.exports = router
