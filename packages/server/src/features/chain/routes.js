const Router = require("koa-router");
const chainController = require("./chain.controller");

const router = new Router();
router.get("/chain", chainController.status);
router.get("/chain/status", chainController.chainStatus);
router.get("/chain/height", chainController.height);
router.get("/chain/daily_transactions", chainController.dailyTransactions);
router.get("/chain/latest", chainController.latest);
router.get("/chain/circulation", chainController.circulation);
router.get("/chain/issuance", chainController.issuance);

module.exports = router;
