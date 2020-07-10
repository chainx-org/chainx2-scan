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
    const rows = await col
      .find({})
      .sort({ "header.number": -1 })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    ctx.body = rows;
  }
}

module.exports = new BlockController();
