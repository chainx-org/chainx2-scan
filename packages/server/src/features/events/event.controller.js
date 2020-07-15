const { extractPage } = require('../../utils')
const { getEventCollection } = require('../../services/mongo')

class EventController {
  async getEvents(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0 || page < 0) {
      ctx.status = 400
      return
    }

    const col = await getEventCollection()
    const total = await col.estimatedDocumentCount()
    const events = await col
      .find({})
      .sort({ 'indexer.blockHeight': -1, index: -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: events,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new EventController()
