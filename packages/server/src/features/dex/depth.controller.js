const { getDb } = require('../../services/mongo')
const { getApi } = require('../../api')

class DepthController {
  async getDepthFromRPC(ctx) {
    const { pairId } = ctx.params
    const { cnt = 50 } = ctx.query
    const api = await getApi()
    const depth = await api.rpc.xspot.getDepth(pairId, cnt)
    const { asks, bids } = depth.toJSON()
    ctx.body = {
      item: {
        asks,
        bids
      }
    }
  }

  async getDepth(ctx) {
    const db = await getDb()
    const col = await db.collection('depth')

    const { pairId } = ctx.params
    const { cnt = 50 } = ctx.query

    const asks = await col
      .find({
        pairId: parseInt(pairId),
        isAsk: true
      })
      .sort({ price: -1 })
      .limit(parseInt(cnt))
      .toArray()

    const bids = await col
      .find({
        pairId: parseInt(pairId),
        isAsk: false
      })
      .sort({ price: -1 })
      .limit(parseInt(cnt))
      .toArray()

    let newAsksprice = []
    for (let i = 0; i < asks.length; i++) {
      let getAprice = asks[i].price
      let getAmount = asks[i].amount
      newAsksprice.push({ [getAprice]: getAmount })
    }
    let newBidsprice = []
    for (let i = 0; i < bids.length; i++) {
      let getBprice = bids[i].price
      let getBAmount = bids[i].amount
      newBidsprice.push({ [getBprice]: getBAmount })
    }

    let sameData = []
    let index =
      newAsksprice.length > newBidsprice.length
        ? newAsksprice.length
        : newBidsprice.length
    let sameKey = []
    let asksPriceKeyArray = []
    let BidsPrcieKeyArray = []
    for (let i = 0; i < index; i++) {
      if (newAsksprice[i]) {
        let asksPriceKey = Object.getOwnPropertyNames(newAsksprice[i])
        asksPriceKeyArray.push(...asksPriceKey)
      }
      if (newBidsprice[i]) {
        let bidsPriceKey = Object.getOwnPropertyNames(newBidsprice[i])
        BidsPrcieKeyArray.push(...bidsPriceKey)
      }
    }

    function getArrEqual(arr1, arr2) {
      let newArr = []
      for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
          if (arr1[j] === arr2[i]) {
            newArr.push(arr1[j])
          }
        }
      }
      return newArr
    }
    sameKey = getArrEqual(asksPriceKeyArray, BidsPrcieKeyArray)
    let SameAskprice = []
    let SameBidsprice = []
    for (let i = 0; i < sameKey.length; i++) {
      let sameAskAmount = newAsksprice.filter(
        item => Object.keys(item)[0] === sameKey[i]
      )
      let sameBidAmount = newBidsprice.filter(
        item => Object.keys(item)[0] === sameKey[i]
      )
      SameAskprice.push(...sameAskAmount)
      SameBidsprice.push(...sameBidAmount)
    }
    let lastestAskprice = []
    let lastestBidprice = []
    for (let i = 0; i < SameAskprice.length; i++) {
      let currentAskItem = SameAskprice[i]
      let currentBidItem = SameBidsprice[i]
      let index = sameKey[i]
      let currentAskAmount = currentAskItem[index]
      let currentBidAmount = currentBidItem[index]
      if (currentAskAmount > currentBidAmount) {
        lastestAskprice.push({
          [sameKey[i]]: currentAskAmount - currentBidAmount
        })
        lastestBidprice.push({ [sameKey[i]]: 0 })
      } else {
        lastestBidprice.push({
          [sameKey[i]]: currentBidAmount - currentAskAmount
        })
        lastestAskprice.push({ [sameKey[i]]: 0 })
      }
    }

    for (let i = 0; i < lastestAskprice.length; i++) {
      let index = parseInt(sameKey[i])
      let newAsks = asks.filter(item => item.price === index)
      newAsks[0].amount = lastestAskprice[i][sameKey[i]]
      let newBids = bids.filter(item => item.price === index)
      newBids[0].amount = lastestBidprice[i][sameKey[i]]
    }

    ctx.body = {
      asks,
      bids
    }
  }
}

module.exports = new DepthController()
