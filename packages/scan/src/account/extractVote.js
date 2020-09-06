const { getVoteCollection } = require('../mongoClient')
const { getApi } = require('../api')

module.exports = async function extractVoteInfo(extrinsic,indexer,signer,args) {
    if (!signer) {
        return;
    }
    const api = await getApi();
    const exCol = await getVoteCollection()
    // skaking信息
    const nominationByAccount = api.rpc.xstaking.getNominationByAccount('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
    // 利息信息

    const dividendByAccount = api.rpc.xstaking.getDividendByAccount('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')
    console.log("nomination:" + JSON.stringify(nominationByAccount ))
    console.log("dividend", JSON.stringify(dividendByAccount))
    console.log(args)
    const data = {
        "node": extrinsic.hash.toHex(),
        "blockHeight" : indexer.blockHeight,
        "history": indexer.blockTime,
        "account": signer,
        "value": args,
        "block": args,
        "nominationByAccount": nominationByAccount,
        "dividendByAccount":dividendByAccount
    }
    const result = await exCol.insertOne(data)
    if (result.result && !result.result.ok) {
        // TODO: 处理插入不成功的情况
        console.log("插入失败")
    }
}
