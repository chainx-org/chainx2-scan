const { handleSystemEvent } = require('./system')
const { handleBalancesEvent } = require('./balances')
const { handleStakingEvent } = require('./xstaking')
const { handleSpotEvent } = require('./xspot')

async function extractEventBusinessData(event, indexer) {
  const { section, method } = event

  if (section === 'system') {
    await handleSystemEvent(event, indexer)
  } else if (section === 'balances') {
    await handleBalancesEvent(event, indexer)
  } else if (section === 'xSpot') {
    await handleSpotEvent(event, indexer)
  } else if (section === 'xStaking') {
    await handleStakingEvent(event, indexer)
  }
}

module.exports = {
  extractEventBusinessData
}
