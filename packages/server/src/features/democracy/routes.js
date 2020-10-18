const Router = require('koa-router')
const democracyController = require('./democracy.controller')

const router = new Router()
router.post('/submit_democracy', democracyController.submitDemocracy)
router.get('/get_democracy', democracyController.getDemocracy)

module.exports = router
