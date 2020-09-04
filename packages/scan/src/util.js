const log4js = require('log4js')

log4js.configure({
  appenders: {
    chainx_scan: { type: 'file', filename: 'chainx_scan.log' },
    out: { type: 'stdout' }
  },
  categories: { default: { appenders: ['out'], level: 'info' } }
})

const logger = log4js.getLogger('chainx_scan')

const sleep = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

module.exports = {
  sleep,
  logger
}
