const { extractPage } = require("../../utils");
const { getBlockCollection } = require("../../services/mongo");

class BlockController {
  async getBlocks(ctx) {
    const { page, pageSize } = extractPage(ctx);
    if (pageSize === 0) {
      ctx.status = 400;
      return;
    }

    const col = await getBlockCollection();
    ctx.body = await col
      .find({})
      .sort({ "header.number": -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();
  }
}

module.exports = new BlockController();
