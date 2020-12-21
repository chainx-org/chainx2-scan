const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const helmet = require('koa-helmet')
const http = require('http')
const cors = require('@koa/cors')
const { initDb } = require('./services/mongo')
const config = require('../config')
//const { Socket } = require('socket.io')
const ratelimit = require('koa-ratelimit')
const compress = require('koa-compress')
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
  .use(
    compress({
      threshold: 2048,
      gzip: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
      },
      deflate: {
        flush: require('zlib').constants.Z_SYNC_FLUSH
      },
      br: false // disable brotli
    })
  )

require('./routes')(app)

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // Fork workers.
  // for (let i = 0; i < numCPUs; i++) {
  for (let i = 0; i < 4; i++) {
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
  const io = require('socket.io')(server, {
    transports: ['websocket', 'polling'],
    cors: {
      // origin: ["https://scan.chainx.org", "https://scan-v2.chainx.org"],
      // methods: ["GET", "POST"]
      origin: '*'
    },
    pingInterval: 6000,
    pingTimeout: 3000
  })

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
