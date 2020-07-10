const Router = require("koa-router");
const blockController = require("./block.controller");

const router = new Router();
router.get("/blocks", blockController.getBlocks);

module.exports = router;
