const {
  getVoteCollection,
  getEventCollection,
  getValidatorsCollection
} = require('../mongoClient')

module.exports = async function extractVoteInfo(
  extrinsic,
  hash,
  indexer,
  name,
  signer,
  args
) {
  if (!signer) {
    return
  }

  const voteCol = await getVoteCollection()
  const eventCol = await getEventCollection()
  const validatorsCol = await getValidatorsCollection()

  // 查找验证人列表
  const validatorList = await validatorsCol.find({}).toArray()
  const currentValidator = await validatorList.find(
    element => element.account == args.target
  )

  // 查找交易 event事件
  const eventList = await eventCol
    .find({ extrinsicHash: extrinsic.hash.toHex() })
    .toArray()
  // 合并交易结果
  let status = null
  eventList.map(ele => {
    if (ele.method === 'ExtrinsicSuccess') {
      status = ele.method
    }
    if (ele.method === 'ExtrinsicFailed') {
      status = ele.method
    }
  })

  const nominationWithValidtorInfo = {
    key: extrinsic.hash.toHex(),
    nominee: '',
    indexer: indexer,
    vote_account: signer,
    nomination: name == 'bond' ? args.value : 0,
    name: name,
    revocations: name === 'unbond' ? args.value : 0,
    last_vote_weight_update: currentValidator.lastTotalVoteWeightUpdate,
    last_vote_weight: currentValidator.lastTotalVoteWeight
  }

  const result = await voteCol.insertOne(nominationWithValidtorInfo)

  if (result.result && !result.result.ok) {
    // TODO: 处理插入不成功的情况
    console.log('插入失败')
  }
}
