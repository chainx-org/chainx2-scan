const { extractPage } = require("../../utils");
const { getExtrinsicCollection } = require("../../services/mongo");

class ExtrinsicController {
  async getExtrinsics(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0) {
      ctx.status = 400;
      return;
    }

    const col = await getExtrinsicCollection();
    ctx.body = await col
      .find({})
      .sort({ "indexer.blockHeight": -1, "indexer.index": 1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
  }
}

module.exports = new ExtrinsicController();
