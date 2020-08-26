const { isMongoId } = require('../../utils')
const { extractPage, ensure0xPrefix, isHash } = require('../../utils')
const { getAccountsCollection } = require('../../services/mongo')
const { ObjectID } = require('mongodb')

class AccountsController {
    async getAccounts(ctx) {
        const { page, pageSize } = extractPage(ctx)
        if (pageSize === 0) {
            ctx.status = 400
            return
        }

        const col = await getAccountsCollection()
        const total = await col.estimatedDocumentCount()
        const accounts = await col
            .find({})
            .sort({ 'header.number': -1 })
            .skip(page * pageSize)
            .limit(pageSize)
            .toArray()

        ctx.body = {
            items: accounts,
            page,
            pageSize,
            total
        }
    }

    async getAccount(ctx) {
        const { address } = ctx.params
        let query = {}
        if (/^\d+$/.test(address)) {
            query = { 'header.number': parseInt(heightOrHashOrId) }
        } else {
            ctx.status = 400
            return
        }

        const col = await getAccountsCollection()
        ctx.body = await col.findOne(query)
    }
}

module.exports = new AccountsController()
