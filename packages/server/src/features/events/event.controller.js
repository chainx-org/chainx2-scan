const { isEventId, extractEvent } = require('./utils')
const { isMongoId } = require('../../utils')
const { extractPage } = require('../../utils')
const { getEventCollection } = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class EventController {
  async getEvents(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0 || page < 0) {
      ctx.status = 400
      return
    }

    const { extrinsic_hash: extrinsicHash } = ctx.query
    const queryExtrinsic = !!extrinsicHash
    const query = queryExtrinsic ? { extrinsicHash } : {}

    const col = await getEventCollection()
    let total
    if (queryExtrinsic) {
      total = await col.countDocuments(query)
    } else {
      total = await col.estimatedDocumentCount()
    }

    const events = await col
      .find(query)
      .sort({ 'indexer.blockHeight': -1, sort: -1 })
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

  async getEvent(ctx) {
    const { id } = ctx.params
    let query = {}
    if (isMongoId(id)) {
      query = ObjectID(id)
    } else if (isEventId(id)) {
      const { blockHeight, eventIndex } = extractEvent(id)
      query = { 'indexer.blockHeight': blockHeight, sort: eventIndex }
    }

    const col = await getEventCollection()
    ctx.body = await col.findOne(query)
  }
}

module.exports = new EventController()
