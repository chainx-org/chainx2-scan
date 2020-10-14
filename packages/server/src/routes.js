const featureRouters = [
  require('./features/blocks/routes'),
  require('./features/extrinsics/routes'),
  require('./features/events/routes'),
  require('./features/accounts/routes'),
  require('./features/nomination/router'),
  require('./features/votes/routes'),
  require('./features/assets/routes'),
  require('./features/dex/routes'),
  require('./features/crossblocks/routes')
]

module.exports = app => {
  for (const router of featureRouters) {
    app.use(router.routes()).use(router.allowedMethods({ throw: true }))
  }
}
