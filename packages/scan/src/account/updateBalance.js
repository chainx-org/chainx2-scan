const { getAccountsCollection } = require('../mongoClient')
const { getPCXAssetByAccount, getAllAssetByAccount } = require('./common')

module.exports = async function extractAuthor(extract, from, dest) {
    if (!from) {
        return;
    }
    const col = await getAccountsCollection();
    const fromBalance = await getPCXAssetByAccount(from) ;
    const destBalnace = await getPCXAssetByAccount(dest);

    const otherFrom = await getAllAssetByAccount(from)
    const otherDest = await getAllAssetByAccount(dest)
    console.log('资产........1111' + otherFrom['1'])

    // 更新from转出账户
    await col.findOneAndUpdate(
        { account: from },
        { $set: { pcx : fromBalance } },
        { $set: { btc : otherFrom && otherFrom['1']  ? otherFrom['1'] : null } },
        { upsert: true }
    )
    // 更新dest转出账户
    await col.findOneAndUpdate(
        { account: dest },
        { $set: { pcx: destBalnace } },
        { $set: { btc: otherDest && otherDest['1'] ? otherDest['1'] : null } },
        { upsert: true }
    )
}
