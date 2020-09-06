const { getExtrinsicCollection, getAccountsCollection } = require('../mongoClient')

module.exports = async function updateTransactionCount(signer) {
    //todo 遗留问题，后续处理
    if (!signer) {
        return;
    }
    const exCol = await getExtrinsicCollection()
    const accountCol = await getAccountsCollection();

    const transactions = await exCol.find({'signer': signer}).toArray();
    let count = 0;
    if (transactions) {
        count = transactions.length;
    }
    // 更新from转出账户
    const result = await accountCol.findOneAndUpdate(
        { account: signer },
        { $set: { count : count } },
        { upsert: true }
    )

    if (result.result && !result.result.ok) {
        // TODO: 处理插入不成功的情况
        console.log("插入失败")
    }
}
