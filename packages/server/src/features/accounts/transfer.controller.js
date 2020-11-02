const { extractPage } = require('../../utils')
const { getTransferColCollection } = require('../../services/mongo')
const { encodeAddress } = require('./utils')
const { Account } = require('@chainx-v2/account')

class TransferController {
  async getTransfer(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      return
    }
    // console.log('address:' + ctx.query.address)

    let address = ctx.query.address
    const col = await getTransferColCollection()
    const total = await col.count({ from: address })
    const transferList = await col
      .find({ from: address })
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

  async accountTransfers(ctx) {
    const { page, pageSize } = extractPage(ctx)
    if (pageSize === 0) {
      ctx.status = 400
      ctx.body = {
        errMsg: 'Invalid pageSize'
      }
      return
    }

    const { address: addressOrId } = ctx.params
    // console.log('addressOrId', addressOrId)
    const isAddress = !addressOrId.startsWith('0x')
    if (isAddress && !Account.isAddressValid(addressOrId)) {
      ctx.body = {
        errMsg: 'illegal address or account id'
      }
      return
    }

    const address = isAddress ? addressOrId : encodeAddress(addressOrId)

    const col = await getTransferColCollection()
    const total = await col.count({ $or: [{ from: address }, { to: address }] })
    const transfers = await col
      .find({ $or: [{ from: address }, { to: address }] })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray()

    ctx.body = {
      items: transfers,
      page,
      pageSize,
      total
    }
  }
}

module.exports = new TransferController()
