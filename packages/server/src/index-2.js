const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const http = require('http')
const cors = require('@koa/cors')
const { initDb } = require('./services/mongo')
const config = require('../config')
const Socket = require('socket.io')
const ratelimit = require('koa-ratelimit')

const app = new Koa()

// apply rate limit
const rateLimit = new Map()

app.use(
  ratelimit({
    driver: 'memory',
    db: rateLimit,
    duration: 60000,
    errorMessage: 'Sometimes You Just Have to Slow Down.',
    id: ctx => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false,
    whitelist: ctx => {
      // some logic that returns a boolean
    },
    blacklist: ctx => {
      // some logic that returns a boolean
    }
  })
)

app
  .use(logger())
  .use(bodyParser())
  .use(cors())
  .use(helmet())

require('./routes')(app)
const server = http.createServer(app.callback())
const io = new Socket(server)

initDb()
  .then(db => {
    require('./io')(io)

    app.context.db = db
    const port = 3218

    server.listen(port, () =>
      console.log(`✅  The server is running at http://localhost:${port}/`)
    )
  })
  .catch(err => {
    console.error('Failed to init db for scan server')
    console.error(err)
    process.exit(1)
  })
