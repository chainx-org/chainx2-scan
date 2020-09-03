const BigNumber = require("bignumber.js");

class ChainController {
    async status(ctx) {
        ctx.body = {
            type: "mainnet"
        };
    }

    // 获取链装填
    async chainStatus(ctx) {
        const status = {}

        ctx.body = status;
    }

    //获取区块高度
    async height(ctx) {
        const height = {}
        ctx.body = { height };
    }

    //获取
    async latest(ctx) {
        const block = {}

        ctx.body = block;
    }

    async dailyTransactions(ctx) {
        const txs = await ctx.db.DailyTransactions.findAll({
            attributes: { exclude: ["height"] },
            order: [["day", "DESC"]],
            raw: true,
            limit: 14
        });

        ctx.body = txs;
    }

    async circulation(ctx) {
        const sum = await ctx.db.Balance.sum("Free", {
            where: { token: "PCX" },
            raw: true
        });

        const free = new BigNumber(sum);

        ctx.body = free
            .dividedBy(Math.pow(10, 8))
            .toNumber()
            .toFixed(8);
    }

    async issuance(ctx) {
        const status = await ctx.db.Status.findOne({
            order: [["best", "DESC"]],
            raw: true
        });

        const issuance = new BigNumber(status["pcx_issuance"]);

        ctx.body = issuance
            .dividedBy(Math.pow(10, 8))
            .toNumber()
            .toFixed(8);
    }
}

module.exports = new ChainController();
