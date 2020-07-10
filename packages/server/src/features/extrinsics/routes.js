const Router = require("koa-router");
const extrinsicController = require("./extrinsic.controller");

const router = new Router();
router.get("/extrinsics", extrinsicController.getExtrinsics);

module.exports = router;
