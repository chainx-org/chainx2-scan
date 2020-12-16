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
const cluster = require('cluster')
const numCPUs = require('os').cpus().length

const app = new Koa()

// apply rate limit
const rateLimit = new Map()

app
  .use(cors())
  .use(logger())
  .use(bodyParser())
  .use(helmet())
  .use(
    ratelimit({
      driver: 'memory',
      db: rateLimit,
      duration: 60000,
      errorMessage: '请求过于频繁(Request too frequently)',
      id: ctx => ctx.ip,
      headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
      },
      max: 120,
      disableHeader: false,
      whitelist: ctx => {
        // some logic that returns a boolean
      },
      blacklist: ctx => {
        // some logic that returns a boolean
      }
    })
  )

require('./routes')(app)

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
  })
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  /*
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);
  */
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

  console.log(`Worker ${process.pid} started`)
}

/*
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
*/
