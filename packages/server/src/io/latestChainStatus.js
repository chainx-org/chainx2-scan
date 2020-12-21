const { setLatestChainStatus } = require('../store')
const { FEED_INTERVAL } = require('./constant')
const { latestChainStatusRoom } = require('./constant')
const { getBlockCollection } = require('../services/mongo')
const { getApi } = require('../api')
const { getDb } = require('../services/mongo')
const { getExtrinsicCollection } = require('../services/mongo')
const { getEventCollection } = require('../services/mongo')
const { getStatusCollection } = require('../services/mongo')
const { getAccountsCollection } = require('../services/mongo')
const { getValidatorsCollection } = require('../services/mongo')
const { getTransferColCollection } = require('../services/mongo')

let chainStatus = {}
// let latestHeader = {}
// let finalizedHeader = {}

async function feedLatestChainStatus(io) {
  try {
    const api = await getApi()
    const db = await getDb()

    // 最新区块高度
    /*
    const statusCol = await getStatusCollection()
    const heightInfo = await statusCol.findOne({ name: 'main-scan-height' })
    chainStatus.best = heightInfo.latestHeight
    */
    /*
    const subscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
      async header => {
        // console.log('get latest header', data)
        latestHeader = await header
      }
    )
    */
    const latestHeader = await api.rpc.chain.getHeader()
    const latestHeight = latestHeader.number
      ? latestHeader.number.toNumber()
      : 0
    chainStatus.best = latestHeight

    // 已确认区块高度
    //console.time('finalized')
    /*
    const finalizedHead = await api.rpc.chain.getFinalizedHead()
    const latestFinalizedBlockHeader = await api.rpc.chain.getHeader(
      finalizedHead
    )
    const finalizedHeight = latestFinalizedBlockHeader.number.toNumber()
    chainStatus.finalized = finalizedHeight
    */
    /*
    const subscribeFinalizedHeads = await api.rpc.chain.subscribeFinalizedHeads(
      async header => {
        // console.log('get latest header', data)
        finalizedHeader = await header
      }
    )
    */
    const finalizedHead = await api.rpc.chain.getFinalizedHead()
    const finalizedHeader = await api.rpc.chain.getHeader(finalizedHead)
    const finalizedHeight = finalizedHeader.number
      ? finalizedHeader.number.toNumber()
      : 0
    chainStatus.finalized = finalizedHeight
    //console.timeEnd('finalized')

    // 已扫描区块高度
    //console.time('scan_height')
    const statusCol = await getStatusCollection()
    const statusInfo = await statusCol.findOne({ name: 'main-scan-height' })
    chainStatus.scan_height = statusInfo.value
    //console.timeEnd('scan_height')

    // 交易总数
    //console.time('ex_count')
    const extrinsicCol = await getExtrinsicCollection()
    //const extrinsicCount = await extrinsicCol.countDocuments({})
    const extrinsicCount = await extrinsicCol.countDocuments()
    chainStatus.extrinsic_count = extrinsicCount
    //console.timeEnd('ex_count')

    // 账户总数
    //console.time('account_count')
    const accountCol = await getAccountsCollection()
    //const accountCount = await accountCol.countDocuments({})
    const accountCount = await accountCol.countDocuments()
    chainStatus.account_count = accountCount
    //console.timeEnd('account_count')

    // 事件总数
    //console.time('event_count')
    const eventCol = await getEventCollection()
    //const eventCount = await eventCol.countDocuments({})
    const eventCount = await eventCol.countDocuments()
    chainStatus.event_count = eventCount
    //console.timeEnd('event_count')

    // 转账总数
    //console.time('transfer')
    //const transferCount = await eventCol.find({method: 'Transfer'}, {}).count()
    const transferCount = await eventCol.countDocuments({ method: 'Transfer' })
    chainStatus.transfer_count = transferCount
    //console.timeEnd('transfer')

    //console.time('validator_count')
    const validatorCol = await getValidatorsCollection()
    // 验证节点总数
    const validatorCount = await validatorCol.countDocuments({
      isValidating: true
    })
    chainStatus.validator_count = validatorCount
    //console.timeEnd('validator_count')

    // 1.节点抵押总数
    // 2.用户投票总数
    // 注：现在用的是节点得票总数，另外将用户的投票总数加起来也可以得到
    //console.time('bonded and votes')
    const allValidators = await validatorCol.find({}).toArray()
    let selfBondedSum = 0
    let totalNomimationSum = 0
    for (let i = 0; i < allValidators.length; i++) {
      selfBondedSum = selfBondedSum + parseFloat(allValidators[i].selfBonded)
      totalNomimationSum =
        totalNomimationSum +
        (parseFloat(allValidators[i].totalNomination) -
          parseFloat(allValidators[i].selfBonded))
    }
    chainStatus.totalValidatorBonded = selfBondedSum
    chainStatus.totalNominationSum = totalNomimationSum
    //console.timeEnd('bonded and votes')

    // 发行总量
    //console.time('total issuance')
    const totalIssuance = await api.query.balances.totalIssuance()
    chainStatus.pcx_issuance = totalIssuance
    //console.timeEnd('total issuance')

    // 届数
    // const trusteeSessctionInfo = await api.rpc.xgatewaycommon.bitcoinTrusteeSessionInfo()
    // const threshold = trusteeSessctionInfo.threshold
    //console.time('era')
    const currentEra = await api.query.xStaking.currentEra()
    chainStatus.vote_cycle = currentEra.toJSON()
    //console.timeEnd('era')

    // 最新价格
    const dealCollection = await db.collection('deals')
    const items = await dealCollection
      .find({})
      .sort()
      .toArray()
    let latestDexPrice = 0
    if (items[items.length - 1]) {
      latestDexPrice = items[items.length - 1].price
    }
    chainStatus.latestPrice = latestDexPrice

    // BTC余额
    const depositMineCol = await db.collection('depositMine')
    const depositMine = await depositMineCol.find().toArray()
    const usableBTC = depositMine[0].balance.Usable
    chainStatus.usableBTC = usableBTC

    // const balance = await api.query.system.account(address)
    /*
    const col = await getBlockCollection()
    const blocks = await col
      .find({})
      .sort({ 'header.number': -1 })
      .limit(blockSize)
      .toArray()

    const simpleBlocks = blocks.map(block => {
      return {
        hash: block.hash,
        number: block.header.number,
        timestamp: block.blockTime,
        extrinsicsCnt: (block.extrinsics || []).length,
        author: block.author
      }
    })

    if (simpleBlocks.length > 0) {
    */
    io.to(latestChainStatusRoom).emit('latestChainStatus', chainStatus)
    setLatestChainStatus(chainStatus)
  } catch (e) {
    console.error(e)
  } finally {
    setTimeout(feedLatestChainStatus.bind(null, io), FEED_INTERVAL)
  }
}

module.exports = {
  feedLatestChainStatus
}
