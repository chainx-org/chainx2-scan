const { logger } = require('../../util')
const {
  getIssueRequestCollection,
  getRedeemRequestCollection
} = require('../../mongoClient')
const { getApi } = require('../../api')
const { Keyring } = require('@polkadot/keyring')

const keyring = new Keyring()

let issueRequestCol = null
let redeemRequestCol = null
let issueRequests = {}
let redeemRequests = {}

async function handleRequestEvent(method, event, { blockHash }) {
  let handlerMap = {
    NewIssueRequest: async () => {
      const [requestId] = event.data.toJSON()
      const api = await getApi()
      issueRequests[requestId] ||= (
        await api.query.xGatewayBitcoinV2.issueRequests.at(blockHash, requestId)
      )
        .unwrap()
        .toJSON()
      let request = issueRequests[requestId]
      request.requester = keyring.encodeAddress(
        keyring.decodeAddress(request.requester),
        44
      )
      request.vault = keyring.encodeAddress(
        keyring.decodeAddress(request.vault),
        44
      )
      issueRequestCol ||= await getIssueRequestCollection()
      issueRequestCol.insertOne({
        _id: requestId,
        ...request,
        status: 'processing'
      })
    },
    IssueRequestExecuted: async () => {
      const [requestId] = event.data.toJSON()
      issueRequestCol ||= await getIssueRequestCollection()
      issueRequestCol.findOneAndUpdate(
        { _id: requestId },
        {
          $set: {
            status: 'completed'
          }
        }
      )
    },
    IssueRequestCancelled: async () => {
      const [requestId] = event.data.toJSON()
      issueRequestCol ||= await getIssueRequestCollection()
      issueRequestCol.findOneAndUpdate(
        { _id: requestId },
        {
          $set: {
            status: 'cancelled'
          }
        }
      )
    },
    NewRedeemRequest: async () => {
      const [requestId] = event.data.toJSON()
      const api = await getApi()
      redeemRequests[requestId] ||= (
        await api.query.xGatewayBitcoinV2.redeemRequests.at(
          blockHash,
          requestId
        )
      )
        .unwrap()
        .toJSON()
      let request = redeemRequests[requestId]
      request.requester = keyring.encodeAddress(
        keyring.decodeAddress(request.requester),
        44
      )
      request.vault = keyring.encodeAddress(
        keyring.decodeAddress(request.vault),
        44
      )
      redeemRequestCol ||= await getRedeemRequestCollection()
      redeemRequestCol.insertOne({
        _id: requestId,
        ...request,
        status: 'processing'
      })
    },
    RedeemExecuted: async () => {
      const [requestId] = event.data.toJSON()
      redeemRequestCol ||= await getRedeemRequestCollection()
      redeemRequestCol.findOneAndUpdate(
        { _id: requestId },
        {
          $set: {
            status: 'completed'
          }
        }
      )
    },
    RedeemCancelled: async () => {
      const [requestId] = event.data.toJSON()
      redeemRequestCol ||= await getRedeemRequestCollection()
      redeemRequestCol.findOneAndUpdate(
        { _id: requestId },
        {
          $set: {
            status: 'cancelled'
          }
        }
      )
    }
  }
  handlerMap[method] && (await handlerMap[method]())
}

module.exports = {
  handleRequestEvent
}
