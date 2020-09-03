const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const { getAccountsCollection,getTransferColCollection,getExtrinsicCollection,getVoteCollection } = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class TransactionController {

    async getTransaction(ctx) {
        const { page, pageSize } = extractPage(ctx)
        if (pageSize === 0) {
            ctx.status = 400
            return
        }
        console.log('address:' + ctx.query.address)

        let address = ctx.query.address
        const col = await getExtrinsicCollection()
        const total = await col.estimatedDocumentCount()
        const transferList = await col
            .find({'signer': address})
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

module.exports = new TransactionController()
