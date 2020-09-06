const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const { getAccountsCollection,getTransferColCollection,getExtrinsicCollection,getVoteCollection } = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class TransferController {

    async getTransfer(ctx) {
        const { page, pageSize } = extractPage(ctx)
        if (pageSize === 0) {
            ctx.status = 400
            return
        }
        console.log('address:' + ctx.query.address)

        let address = ctx.query.address
        const col = await getTransferColCollection()
        const total = await col.count({'sender': address})
        const transferList = await col
            .find({'sender': address})
            .skip(page * pageSize)
            .limit(pageSize)
            .toArray()

        ctx.body = {
            items: transferList,
            page,
            pageSize,
            total
        }

    }



}

module.exports = new TransferController()
