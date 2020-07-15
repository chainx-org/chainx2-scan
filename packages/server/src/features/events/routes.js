const Router = require('koa-router')
const eventController = require('./event.controller')

const router = new Router()
router.get('/events', eventController.getEvents)

module.exports = router
