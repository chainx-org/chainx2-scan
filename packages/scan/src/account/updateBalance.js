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

    // 更新from转出账户
    await col.findOneAndUpdate(
        { account: from },
        { $set: { pcx : fromBalance } },
        { $set: { other : otherFrom } },
        { upsert: true }
    )
    // 更新dest转出账户
    await col.findOneAndUpdate(
        { account: dest },
        { $set: { pcx: destBalnace } },
        { $set: { other: otherDest } },
        { upsert: true }
    )
}
