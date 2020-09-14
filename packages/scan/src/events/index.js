const { handleXAssetsEvent } = require('./xAssets')
const { handleSystemEvent } = require('./system')
const { handleBalancesEvent } = require('./balances')
const { handleStakingEvent } = require('./xstaking')
const { handleSpotEvent } = require('./xSpot')

async function extractEventBusinessData(event, indexer) {
  const { section } = event

  if (section === 'system') {
    await handleSystemEvent(event, indexer)
  } else if (section === 'balances') {
    await handleBalancesEvent(event, indexer)
  } else if (section === 'xSpot') {
    await handleSpotEvent(event, indexer)
  } else if (section === 'xStaking') {
    await handleStakingEvent(event, indexer)
  } else if (section === 'xAssets') {
    await handleXAssetsEvent(event, indexer)
  }
}

module.exports = {
  extractEventBusinessData
}
