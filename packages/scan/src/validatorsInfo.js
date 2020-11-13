const { getApi } = require('./api')
const { getValidatorsCollection } = require('./mongoClient')

let unSubscribeValidators = null

function getUnSubscribeValidatorsFunction() {
  return unSubscribeValidators
}

async function listenAndUpdateValidators(chainHeight) {
  const api = await getApi()

  // const height = await api.query.system.number()
  console.log('update validators at height: ', chainHeight)
  await updateValidatorsInfo(chainHeight)
  /*
  unSubscribeValidators = await api.query.xStaking.currentEra(async era => {
    const height = await api.query.system.number()
    await updateValidatorsInfo(height.toNumber())
  })
  */
}

async function updateValidatorsInfo(queryHeight) {
  const api = await getApi()
  const validators = await api.rpc.xstaking.getValidators()

  const validatorsCol = await getValidatorsCollection()
  await validatorsCol.deleteMany({})
  const infoArr = validators.toJSON().map(validator => ({
    queryHeight,
    ...validator
  }))

  const { result } = await validatorsCol.insertMany(infoArr)
  if (!result.ok) {
    // TODO: 处理插入不成功的情况。这里可能产生问题的，因为我们之前已经把这个collection清空了
  }
}

module.exports = {
  listenAndUpdateValidators,
  getUnSubscribeValidatorsFunction
}
