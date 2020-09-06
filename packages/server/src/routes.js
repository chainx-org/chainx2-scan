const featureRouters = [
  require('./features/blocks/routes'),
  require('./features/extrinsics/routes'),
  require('./features/events/routes'),
  require('./features/accounts/routes'),
  require('./features/transfer/routes'),
  require('./features/transaction/routes'),
  require('./features/nomination/router'),
  require('./features/orders/routes')
]

module.exports = app => {
  for (const router of featureRouters) {
    app.use(router.routes()).use(router.allowedMethods({ throw: true }))
  }
}
