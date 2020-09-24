const { updateDepthByEvents } = require('./dex/depth')
const { deleteDataFrom } = require('./rollback')
const { isExtrinsicSuccess } = require('./events/utils')
const { u8aToHex } = require('@polkadot/util')
const { sleep, logger } = require('./util')
const { extractExtrinsicBusinessData } = require('./extrinsic')
const { extractExtrinsicEvents } = require('./events/utils')
const { init } = require('./init')

const {
  getExtrinsicCollection,
  getBlockCollection,
  getEventCollection,
  getFirstScanHeight,
  updateScanHeight
} = require('./mongoClient')
const { getApi, disconnect } = require('./api')
const {
  updateHeight,
  getLatestHeight,
  getUnSubscribeNewHeadFunction
} = require('./latestHead')
const { updateAssetsInfo } = require('./assetsInfo')
const { updateChainProperties } = require('./chainProperties')
const {
  extractAuthor,
  extractBlockTime,
  findNonForkHeight
} = require('./block')
const {
  listenAndUpdateValidators,
  getUnSubscribeValidatorsFunction
} = require('./validatorsInfo')

const { extractEventBusinessData } = require('./events')

let preBlockHash = null

async function main() {
  // 更新区块高度
  await updateHeight()
  // 初始化sdk
  const api = await getApi()
  await updateChainProperties()
  // 监听并更新validators
  await listenAndUpdateValidators()
  // 获取首个扫描区块高度
  let scanHeight = await getFirstScanHeight()
  await deleteDataFrom(scanHeight)
  await init(scanHeight)

  while (true) {
    const chainHeight = getLatestHeight()
    if (scanHeight > chainHeight) {
      // 如果要检索的高度大于现在的最大高度，那么等一等
      await sleep(1000)
      continue
    }

    let blockHash
    try {
      blockHash = await api.rpc.chain.getBlockHash(scanHeight)
    } catch (e) {
      console.log(e.message)
      await sleep(1000)
      continue
    }

    if (!blockHash) {
      // 正常情况下这种情况不应该出现，上边已经判断过`scanHeight > chainHeight`
      await sleep(1000)
      continue
    }

    const block = await api.rpc.chain.getBlock(blockHash)
    if (
      preBlockHash &&
      block.block.header.parentHash.toString('hex') !== preBlockHash
    ) {
      // 出现分叉，当前块的parentHash不等于数据库中的上一个块的hash
      const nonForkHeight = await findNonForkHeight(scanHeight)
      await updateScanHeight(nonForkHeight)
      scanHeight = nonForkHeight + 1
      preBlockHash = null
      await deleteDataFrom(scanHeight)
      continue
    }

    const validators = await api.query.session.validators.at(blockHash)
    const author = extractAuthor(validators, block.block.header)

    logger.info('indexing block:', block.block.header.number.toString())
    await handleBlock(block.block, author)
    preBlockHash = block.block.hash.toHex()

    await updateAssetsInfo(scanHeight)
    await updateScanHeight(scanHeight++)
  }
}

async function handleEvents(events, indexer, extrinsics) {
  if (events.length <= 0) {
    return
  }

  const eventCol = await getEventCollection()
  const bulk = eventCol.initializeOrderedBulkOp()
  for (let sort = 0; sort < events.length; sort++) {
    const { event, phase, topics } = events[sort]
    const phaseType = phase.type
    let [phaseValue, extrinsicHash] = [null, null]
    if (!phase.isNull) {
      phaseValue = phase.isNull ? null : phase.value.toNumber()
      extrinsicHash = extrinsics[phaseValue].hash.toHex()
    }

    const index = parseInt(event.index)
    const meta = event.meta.toJSON()
    const section = event.section
    const method = event.method
    const data = event.data.toJSON()

    await extractEventBusinessData(event, indexer)

    bulk.insert({
      indexer,
      extrinsicHash,
      phase: {
        type: phaseType,
        value: phaseValue
      },
      sort,
      index,
      section,
      method,
      meta,
      data,
      topics
    })
  }

  const result = await bulk.execute()
  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
  }
}

async function handleBlock(block, author) {
  // 获取区块的hash
  const hash = block.hash.toHex()
  const blockJson = block.toJSON()
  // 获取区块的高度
  const blockHeight = block.header.number.toNumber()
  // 获取区块交易时间
  const blockTime = extractBlockTime(block.extrinsics)
  // 组装 blockhHeight, blockHash, blockTime合成index
  const blockIndexer = { blockHeight, blockHash: hash, blockTime }

  const api = await getApi()
  const allEvents = await api.query.system.events.at(hash)
  await handleEvents(allEvents, blockIndexer, block.extrinsics)
  await updateDepthByEvents(allEvents)

  const blockCol = await getBlockCollection()
  const result = await blockCol.insertOne({
    hash,
    blockTime,
    author,
    ...blockJson
  })
  if (result.result && !result.result.ok) {
    // FIXME: 处理插入不成功的情况
  }

  let index = 0
  for (const extrinsic of block.extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index)

    await handleExtrinsic(
      extrinsic,
      {
        blockHeight,
        blockHash: hash,
        blockTime,
        index: index++
      },
      events
    )
  }

  //console.log(`block ${blockHeight} inserted.`)
}

/**
 *
 * 解析并处理交易
 *
 */
async function handleExtrinsic(extrinsic, indexer, events) {
  // TODO: 利用events可以判断交易是否执行成功
  const hash = extrinsic.hash.toHex()
  const callIndex = u8aToHex(extrinsic.callIndex)
  const { args } = extrinsic.method.toJSON()
  const name = extrinsic.method.methodName
  const section = extrinsic.method.sectionName
  let signer = extrinsic._raw.signature.get('signer').toString()
  //如果signer的解析长度不正确，则该交易是无签名交易
  if (signer.length < 48) {
    signer = ''
  }

  await extractExtrinsicBusinessData(extrinsic, indexer, events)
  const isSuccess = isExtrinsicSuccess(events)

  const version = extrinsic.version
  const data = u8aToHex(extrinsic.data) // 原始数据

  const doc = {
    hash,
    indexer,
    signer,
    section,
    name,
    callIndex,
    version,
    args,
    data,
    isSuccess
  }

  const exCol = await getExtrinsicCollection()
  const result = await exCol.insertOne(doc)
  if (result.result && !result.result.ok) {
    // FIXME: 处理交易插入不成功的情况
  }
}

main()
  .then(r => {
    // TODO:
  })
  .catch(err => {
    // TODO:
    console.error(err)
  })
  .finally(cleanUp)

function cleanUp() {
  console.log('clean up')
  const unsubscribeNewHead = getUnSubscribeNewHeadFunction()
  if (typeof unsubscribeNewHead === 'function') {
    unsubscribeNewHead()
  }
  const unSubscribeValidators = getUnSubscribeValidatorsFunction()
  if (typeof unSubscribeValidators === 'function') {
    unSubscribeValidators()
  }
  disconnect()
  process.exit(0)
}

process.on('SIGINT', cleanUp)
