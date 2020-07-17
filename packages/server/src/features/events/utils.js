function isEventId(str = '') {
  return /^\d+-\d+$/.test(str)
}

function extractEvent(eventId = '') {
  const [blockHeight, eventIndex] = eventId.split('-')
  return {
    blockHeight: parseInt(blockHeight),
    eventIndex: parseInt(eventIndex)
  }
}

module.exports = {
  isEventId,
  extractEvent
}
