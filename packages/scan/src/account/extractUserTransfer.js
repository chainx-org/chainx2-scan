const { getTransferColCollection } = require('../mongoClient')

module.exports = async function extractUserTransfer(extrinsic,indexer,signer,args) {
    if (!signer) {
        return;
    }
    const exCol = await getTransferColCollection()
    console.log(args)
    const data = {
        "hash": extrinsic.hash.toHex(),
        "blockHeight" : indexer.blockHeight,
        "blockTime": indexer.blockTime,
        "sender": signer,
        "receiver": args.dest,
        "value": args.value,
        "memo": args.memo
    }
    const result = await exCol.insertOne(data)
    if (result.result && !result.result.ok) {
        // TODO: 处理插入不成功的情况
        console.log("插入失败")
    }
}
