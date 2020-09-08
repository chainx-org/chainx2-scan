const Router = require('koa-router')
const votesController = require('./votes.controller')

const router = new Router()

router.get('/votes', votesController.getVotes)
router.get('/votes/:nominator', votesController.getVotesOf)

module.exports = router
