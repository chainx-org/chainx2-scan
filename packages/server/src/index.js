const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const http = require('http')
const cors = require('@koa/cors')
const { initDb } = require('./services/mongo')
const config = require('../config')
const Socket = require('socket.io')

const app = new Koa()

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
    const port = config.server.port || 3213

    server.listen(port, () =>
      console.log(`✅  The server is running at http://localhost:${port}/`)
    )
  })
  .catch(err => {
    console.error('Failed to init db for scan server')
    console.error(err)
    process.exit(1)
  })
